export class DataSubscriber {
  
  constructor(public uid:string,
              public displayName:string){
  
  }
  public static createInstance(dataSubscriber:DataSubscriber):DataSubscriber{
    return new DataSubscriber(dataSubscriber.uid,dataSubscriber.displayName);
  }
}
