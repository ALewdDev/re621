/**
 * ===== Single-response functions =====
 * Executed upon being called, send a response, then terminate.
 * Must be called from XM.Chrome.execBackgroundRequest()
 */

declare const chrome : any;

const { tabs , runtime } = chrome;

const { body } = document;

const tabQuery = {
  active: true,
  currentWindow: true,
  windowType: 'normal'
};

const responses = {
  XM: {
    Util: {
      openInTab: (url: string,active: boolean) : Promise<boolean> => {
        return new Promise((resolve) => {
          tabs.query(tabQuery,(data: any) => {
            let index: number;

            if(typeof data[0] !== 'undefined')
              index = data[0] + 1;

            tabs.create({ url , active , index },() => resolve(true));
          });
        })
      },
      setClipboard: (data: string) : void => {
        const source = document.createElement('textarea');
        source.textContent = data;
        body.appendChild(source);
        document.execCommand('copy');
        source.blur();
        body.removeChild(source);
      }
    }
  }
}


/*
    <async> <Promise> : Handle Background Messsage : (request) (respond)
*/

async function handleBackgroundMessage(request: any,respond: Function): Promise<void> {

  const { args , method , module , component , eventID } = request;

  const response = responses?.[component]?.[module]?.[method];

  let data = `RE6 Background - Invalid Request`;

  if(response)
    data = await response(...args);

  respond({ eventID , data });
}


// This has to be in a separate function because otherwise the port closes prematurely

chrome.runtime.onMessage.addListener((request: any,_: any,callback: Function) => {
  handleBackgroundMessage(request,callback);
  return true;
});


/**
 * ===== Multi-response functions =====
 * Establish a connection upon being called, then send multiple responses before terminating.
 * Must be called from XM.Chrome.execBackgroundConnection()
 */

/**
 * Process an xmlHttpRequest
 * @param { object } port
 * @param { object } details
 */

function xmlHttpNative(port: any,details: any) : void {

  const allowedTypes = [ '' , 'document' ];

  const { data , method , url , username , password , headers , responseType , overrideMimeType } = details;


  const request = new XMLHttpRequest();


  /**
      Post reponse when even is fired.
  */

  const responseEvents = [ 'onabort' , 'onerror' , 'onloadstart' , 'onreadystatechange' , 'ontimeout' ];

  for(const event of responseEvents)
    request[event] = () : void => postResponse(event);



  /** **onprogress**
    callback to be executed if the request made some progress
  */

  request.onprogress = (event) : void => {
    const { total , loaded } = event;

    // Sometimes, total is 0. If it is, the length cannot be computed.

    const msg = { total , loaded , lengthComputable: total > 0 };

    port.postMessage(createResponse('onprogress',request,msg));
  }


  /** **onload**
    callback to be executed if the request was loaded.
  */

  request.onload = () : void => {
    let { status , response , readyState , responseXML , responseText , responseType } = request;

    if(readyState !== 4)
      return;

    let
      msg: object,
      event = 'onerror';

    if(status >= 200 && status < 300){

      event = 'onload';

      if(!allowedTypes.includes(responseType))
        responseXML = responseText = null;

      if(responseType !== 'blob')
        response = URL.createObjectURL(response);

      const responseHeaders = request.getAllResponseHeaders();

      msg = { response , responseXML , responseText , responseHeaders };
    }

    postResponse(event,msg);
  }


  // Open

  request.open(method,url,true,username,password);

  delete headers['User-Agent'];


  // Request Header

  for(const header in headers)
    request.setRequestHeader(header,headers[header]);


  // ArrayBuffer -> Blob (ObjectURL Conversion)

  if(responseType)
    request.responseType = (responseType === 'arraybuffer') ? 'blob' : responseType;

  if(overrideMimeType)
    request.overrideMimeType(overrideMimeType);

  request.send(data);


  /*
      <any> : Create Response
  */

  function createResponse(event: string,request: any,data?: any) : object {
    const
      { status , finalURL , readyState , statusText } = request,
      result = { event , status , finalURL , readyState , statusText };

    for(const key in data)
      result[key] = data[key];

    return result;
  }


  /*
      <void> : Post Response
  */

  function postResponse(eventType: string,msg?: any) : void {
    port.postMessage(createResponse(eventType,request,msg));
  }
}


/*
    Listen To ContentScript
*/

const { onConnect } = chrome.runtime;

onConnect.addListener((port: any) => {

  const { name , onMessage } = port;

  switch(name){
  case 'XHR':
    onMessage.addListener((msg: any) => xmlHttpNative(port,msg));
    return;
  default:
    port.postMessage({
      eventID: 0,
      data: `RE6 Background - Invalid Request`
    });
  }
});
