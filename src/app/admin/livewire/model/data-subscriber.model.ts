import * as moment from 'moment-mini-ts';

export class DataSubscriber {
  
  constructor(public uid:string,
              public displayName:string,
              public creationTime:any,
              public active:any,
              public primaryEmail:any,
              public subscriberType:any,
              public pushEmails:string[],
              public usersWithAccess:string[]){
  
  }
  public static createInstance(dataSubscriber:DataSubscriber):DataSubscriber{
    return new DataSubscriber(dataSubscriber.uid,
                              dataSubscriber.displayName,
                              moment(dataSubscriber.creationTime),
                              dataSubscriber.active,
                              dataSubscriber.primaryEmail,
                              dataSubscriber.subscriberType,
                              dataSubscriber.pushEmails,
                              dataSubscriber.usersWithAccess);
  }
}
