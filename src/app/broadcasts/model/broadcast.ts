import {DatePipe} from '@angular/common';

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
              public topics: string[]){


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

