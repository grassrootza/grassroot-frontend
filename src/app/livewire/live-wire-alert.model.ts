import { LiveWireAlertDestType } from "./live-wire-alert-dest-type.enum";
import { LiveWireAlertType } from "./live-wire-alert-type.enum";
import * as moment from 'moment';

export class LiveWireAlert {
  
  constructor(public serverUid:string,
              public headline:string,
              public description:string,
              public creationTimeMillis:any,
              public alertType:LiveWireAlertType,
              public creatingUserName:string,
              public contactUserName:string,
              public contactUserPhone:string,
              public meetingName:string,
              public meetingTimeMillis:any,
              public meetingLocation:string,
              public ancestorGroupName:string,
              public groupSize:number,
              public groupUid:string,
              public groupCreationMillis:any,
              public groupTasks:number,
              public tags:string[],
              public reviewed:boolean,
              public sent:boolean,
              public longitude:number,
              public latitude:number,
              public destType:LiveWireAlertDestType,
              public mediaFileUids:string[]){}
  
  public static createInstance(liveWireAlert:LiveWireAlert):LiveWireAlert{
    return new LiveWireAlert(liveWireAlert.serverUid,
                            liveWireAlert.headline,
                            liveWireAlert.description,
                            moment(liveWireAlert.creationTimeMillis),
                            liveWireAlert.alertType,
                            liveWireAlert.creatingUserName,
                            liveWireAlert.contactUserName,
                            liveWireAlert.contactUserPhone,
                            liveWireAlert.meetingName,
                            moment(liveWireAlert.meetingTimeMillis),
                            liveWireAlert.meetingLocation,
                            liveWireAlert.ancestorGroupName,
                            liveWireAlert.groupSize,
                            liveWireAlert.groupUid,
                            moment(liveWireAlert.groupCreationMillis),
                            liveWireAlert.groupTasks,
                            liveWireAlert.tags,
                            liveWireAlert.reviewed,
                            liveWireAlert.sent,
                            liveWireAlert.longitude,
                            liveWireAlert.latitude,
                            liveWireAlert.destType,
                            liveWireAlert.mediaFileUids);
  }
}

export class LiveWireAlertPage{
    constructor(public number: number,
              public totalPages: number,
              public totalElements: number,
              public size: number,
              public first: boolean,
              public last: boolean,
              public content: LiveWireAlert[]) {
  }
}
