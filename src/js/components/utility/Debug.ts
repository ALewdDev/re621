import { XM } from '../api/XM';


type Flag = 'enabled' | 'connect' | 'perform' | 'vivaldi';
const flags = [ 'enabled' , 'connect' , 'perform' , 'vivaldi' ];


/*
    <string> : Name Of Type
*/

const nameOfType = (type: string) : string =>
  `re621.debug.${ type }`;


/*
    <void> : Read Setting
*/

const readSetting = async (type: string) =>
  Debug[type] = XM.Storage.getValue(nameOfType(type),false);



/*
    <void> : Write Setting
*/

const writeSetting = (type: string,enabled: boolean) : void => {
  enabled ||= undefined;
  XM.Storage.setValue(`re621.debug.${ type }`,enabled);
};



export class Debug {

  private static enabled: boolean;
  private static connect: boolean;
  private static perform: boolean;
  private static vivaldi: boolean;


  /*
      <Promise> : Initialize Logger
  */

  public static init() : Promise<any> {
    const promises = flags.map(readSetting);

    return Promise.all(promises);
  }


  /*
      <bool> : Set State
  */

  public static getState(type: Flag) : boolean {
    return Debug[type];
  }


  /*
      <bool> : Get State
  */

  public static setState(type: Flag,enabled: boolean) : void {
    Debug[type] = enabled;
    writeSetting(type,enabled);
  }


  /*
      <void> : Log
  */

  public static log(...data: any[]) : void {
    if(!Debug.enabled)
      return;

    console.log(...data);
  }


  /*
      <void> : Connect Log
  */

  public static connectLog(...data: any[]) : void {
    if(!Debug.connect)
      return;

    console.log('CONNECT',...data);
  }


  /*
      <void> : Perf Start
  */

  public static perfStart(input: string) : void {
    if(!Debug.perform)
      return;

    console.time(input);
  }


  /*
      <void> : Perf End
  */

  public static perfEnd(input: string) : void {
    if(!Debug.perform)
      return;

    console.timeEnd(input);
  }
}
