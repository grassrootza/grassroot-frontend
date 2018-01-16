import {DateTimeUtils} from "../../utils/DateTimeUtils";
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {NgbTime} from '@ng-bootstrap/ng-bootstrap/timepicker/ngb-time';

export class BroadcastRequest {

  type: string;
  parentId: string;

  title: string = "";

  sendShortMessages: boolean = false;
  shortMessageString: string = "";

  sendEmail: boolean = false;
  emailContent: string = "";

  postToFacebook: boolean = false;
  facebookPage: string = "";
  facebookContent: string = "";
  facebookLink: string = "";

  postToTwitter: boolean = false;
  twitterAccount: string = "";
  twitterContent: string = "";
  twitterLink: string = "";

  selectionType: string = "ALL_MEMBERS";
  subgroups: string[] = [];
  provinces: string[] = [];
  topics: string[] = [];

  sendType: string = "IMMEDIATE"; // options: IMMEDIATE, FUTUREADDED_TO_GROUP
  sendNow: boolean = true;
  sendOnJoin: boolean = false;
  sendAtTime: boolean = false;
  sendDate: string = Date();

  sendDateTimeMillis: number;

  // todo : probably reuse this instead of recreating if we cancel and re-enter
  clear() {
    this.title = "";
    this.sendShortMessages = false;
    this.shortMessageString = "";
    this.sendEmail = false;
    this.emailContent = "";
    this.postToFacebook = false;
    this.facebookPage = "";
    this.facebookContent = "";
    this.facebookLink = "";
    this.postToTwitter = false;
    this.twitterContent = "";
    this.provinces = [];
    this.topics = [];
  }


}

export class BroadcastTypes {

  shortMessage: boolean = false;
  email: boolean = false;
  facebook: boolean = false;
  facebookPage: string = "";
  twitter: boolean = false;
  twitterAccount: string = "";

}

export class BroadcastContent {

  // todo: images and file attachments
  title: string = "";
  shortMessage: string = "";
  emailContent: string = "";
  facebookPost: string = "";
  facebookLink: string = "";
  twitterPost: string = "";
  twitterLink: string = "";

}

export class BroadcastMembers {

  selectionType: string = "ALL_MEMBERS";
  taskTeams: string[] = [];
  provinces: string[] = [];
  topics: string[] = [];

}

export class BroadcastCost {
  smsNumber: number = 999;
  broadcastCost: string = "0.00";
}

export class BroadcastSchedule {

  sendType: string = "IMMEDIATE";
  sendDate: string = Date();
  dateEpochMillis: NgbDateStruct = DateTimeUtils.dateFromDate(new Date());
  timeEpochMillis: NgbTimeStruct = DateTimeUtils.timeFromDate(new Date());

}

export class BroadcastConfirmation {

  sendShortMessage: boolean;
  smsNumber: number;
  sendEmail: boolean;
  sendEmailCount: number;
  postFacebook: boolean;
  fbPageName: string;
  postTwitter: boolean;
  twitterAccount: string;

  totalMemberCount: number;
  topics: string[];
  provinces: string[];

  sendTimeDescription: string;
  sendTime: string;

  broadcastCost: string;

}
