import {DatePipe} from '@angular/common';
import { DateTimeUtils } from '../../utils/DateTimeUtils';

export class Broadcast {
  constructor(public broadcastUid: string,
              public title: string,
              public succeeded : boolean,
              public shortMessageSent: boolean,
              public emailSent: boolean,
              public smsCount:number,
              public emailCount: number,
              public fbPages: string[],
              public twitterAccount: string,
              public dateTimeSent: Date,
              public scheduledSendTime: Date,
              public costEstimate: number,
              public smsContent: string,
              public emailContent: string,
              public fbPost: string,
              public twitterPost: string,
              public hasFilter: boolean,
              public totalSent: number,
              public provinces: string [],
              public topics: string[],
              public createdByUser: boolean) {


    // this.formatteddateTimeSent = new DatePipe("en").transform(this.dateTimeSent,"d MMM y, hh:MM a");

  }

  getFormattedDateTimeSent():string{
    if(this.dateTimeSent == null){
      return "";
    }
    else{
      let currentDate = new Date();
      let twoDatesSame = this.areTwoDatesSame(currentDate, this.dateTimeSent);

      if(twoDatesSame){
        return new DatePipe("en").transform(this.dateTimeSent, "hh:MM a");
      }else{
        return new DatePipe("en").transform(this.dateTimeSent, "d MMM y");
      }
    }
  }

  getFormattedScheduleDateTimeSend():string{
    if(this.scheduledSendTime == null){
      return "";
    }
    else{
      let currentDate = new Date();
      let twoDatesSame = this.areTwoDatesSame(currentDate, this.scheduledSendTime);

      if(twoDatesSame){
        return new DatePipe("en").transform(this.scheduledSendTime, "hh:MM a");
      }else{
        return new DatePipe("en").transform(this.scheduledSendTime, "d MMM y");
      }
    }
  }


  areTwoDatesSame(currentDate, broadcastDate):boolean{
    let yearEqual = currentDate.getFullYear() === broadcastDate.getFullYear();
    let monthEqual = currentDate.getMonth() === broadcastDate.getMonth();
    let dayEqual = currentDate.getDate() === broadcastDate.getDate();

    return yearEqual && monthEqual && dayEqual;

  }
}

export class BroadcastPage {

  constructor(public number: number,
              public totalPages: number,
              public totalElements: number,
              public size: number,
              public first: boolean,
              public last: boolean,
              public content: Broadcast[]) {
  }

}

export const transform = (bc: Broadcast): Broadcast => {
  return new Broadcast(
    bc.broadcastUid,
    bc.title,
    bc.succeeded,
    bc.shortMessageSent,
    bc.emailSent,
    bc.smsCount,
    bc.emailCount,
    bc.fbPages,
    bc.twitterAccount != null ? bc.twitterAccount : "",
    bc.dateTimeSent != null ? DateTimeUtils.getDateFromJavaInstant(bc.dateTimeSent) : null,
    bc.scheduledSendTime != null ? DateTimeUtils.getDateFromJavaInstant(bc.scheduledSendTime) : null,
    bc.costEstimate,
    bc.smsContent,
    bc.emailContent,
    bc.fbPost,
    bc.twitterPost,
    bc.hasFilter,
    bc.smsCount + bc.emailCount,
    bc.provinces,
    bc.topics,
    bc.createdByUser
  )
} 