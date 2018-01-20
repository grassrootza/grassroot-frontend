import * as moment from "moment";
import {Moment} from "moment";

export class Notification {


  constructor(public uid: string,
              public notificationType: string,
              public delivered: boolean,
              public read: boolean,
              public viewedAndroid: boolean,
              public groupUid: string,
              public title: string,
              public imageUrl: string,
              public defaultImage: string,
              public entityUid: string, // i.e., uid of the event/etc that the logbook was attached to
              public message: string,
              public createdDatetime: Moment,
              public deadlineDateTime: Moment,
              public entityType: string,
              public changeType: string) {
  }

  public static transformDates(ntf: Notification) {
    console.log("Transforming dates: ", ntf.createdDatetime, ntf.deadlineDateTime);
    ntf.createdDatetime = moment(ntf.createdDatetime);
    ntf.deadlineDateTime = moment(ntf.deadlineDateTime);
    return ntf;
  }
}
