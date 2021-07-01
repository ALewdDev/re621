import { XM } from '../api/XM';


/*
    <Promise<bool>> : Test Connection

    Test if a request can successfully be made.
*/

const testConnection = () : Promise<boolean> =>
  new Promise((resolve) => {
    XM.Connect.xmlHttpRequest({
      onerror: () => resolve(false),
      onload: () => resolve(true),
      url: `https://e621.net/`,
      method: 'HEAD'
    });
  });



export default {

  /*
      <bool> : Is Online

      Check if the user is connected to the internet.
  */

  isOnline: () : Promise<boolean> => {
    return navigator.onLine ? testConnection() : Promise.resolve(false);
  }
}
