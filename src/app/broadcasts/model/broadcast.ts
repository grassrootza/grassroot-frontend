import {DatePipe} from '@angular/common';
import {Membership} from '../../groups/model/membership.model';

export class Broadcast {
  constructor(public title: string,
              public shortMessageSent: boolean,
              public emailSent: boolean,
              public smsCount:number,
              public emailCount: number,
              public fbPage: string,
              public twitterAccount: string,
              public dateTimeSent: Date,
              public scheduledSendTime: Date,
              public costEstimate: number,
              public smsContent: string,
              public emailContent: string,
              public fbPost: string,
              public twitterPost: string,
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

