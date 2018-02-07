import {DateTimeUtils} from "../../utils/DateTimeUtils";
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

export class BroadcastRequest {

  broadcastId: string;
  type: string;
  parentId: string;

  title: string = "";

  sendShortMessages: boolean = false;
  shortMessageString: string = "";

  sendEmail: boolean = false;
  emailContent: string = "";

  postToFacebook: boolean = false;
  facebookPages: string[] = [];
  facebookContent: string = "";
  facebookLink: string = "";
  facebookLinkCaption: string = "";
  facebookImageKey: string = "";

  postToTwitter: boolean = false;
  twitterAccount: string = "";
  twitterContent: string = "";
  twitterLink: string = "";
  twitterLinkCaption: string = "";
  twitterImageKey: string = "";

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

  clear() {
    this.broadcastId = "";
    this.type = "";
    this.parentId = "";
    this.title = "";
    this.sendShortMessages = false;
    this.shortMessageString = "";
    this.sendEmail = false;
    this.emailContent = "";
    this.postToFacebook = false;
    this.facebookPages = [];
    this.facebookContent = "";
    this.facebookLink = "";
    this.postToTwitter = false;
    this.twitterContent = "";
    this.provinces = [];
    this.topics = [];

    this.selectionType = "ALL_MEMBERS";
    this.subgroups = [];
    this.provinces = [];
    this.topics = [];

    this.sendType = "IMMEDIATE"; // options: IMMEDIATE, FUTUREADDED_TO_GROUP
    this.sendNow = true;
    this.sendOnJoin = false;
    this.sendAtTime = false;
    this.sendDate = Date();

    this.sendDateTimeMillis = 0;
  }

  copyFields(br: BroadcastRequest) {
    this.broadcastId = br.broadcastId;
    this.type = br.type;
    this.parentId = br.parentId;

    this.title = br.title;
    this.sendShortMessages = br.sendShortMessages;
    this.shortMessageString = br.shortMessageString;
    this.sendEmail = br.sendEmail;
    this.emailContent = br.emailContent;
    this.postToFacebook = br.postToFacebook;
    this.facebookPages = br.facebookPages;
    this.facebookContent = br.facebookContent;
    this.facebookLink = br.facebookLink;
    this.postToTwitter = br.postToTwitter;
    this.twitterContent = br.twitterContent;
    this.provinces = br.provinces;
    this.topics = br.topics;

    this.selectionType = br.selectionType;
    this.subgroups = br.subgroups;
    this.provinces = br.provinces;
    this.topics = br.topics;

    this.sendType = br.sendType; // options: IMMEDIATE, FUTUREADDED_TO_GROUP
    this.sendNow = br.sendNow;
    this.sendOnJoin = br.sendOnJoin;
    this.sendAtTime = br.sendAtTime;
    this.sendDate = br.sendDate;

    this.sendDateTimeMillis = br.sendDateTimeMillis;
}
}

export class BroadcastTypes {
  shortMessage: boolean = false;
  email: boolean = false;
  facebook: boolean = false;
  facebookPages: string[] = [];
  twitter: boolean = false;
  twitterAccount: string = "";
}

export class BroadcastContent {
  title: string = "";
  shortMessage: string = "";
  emailContent: string = "";
  facebookPost: string = "";
  facebookLink: string = "";
  facebookLinkCaption: string = "";
  facebookImageKey: string = "";
  twitterPost: string = "";
  twitterLink: string = "";
  twitterLinkCaption: string = "";
  twitterImageKey: string = "";

  smsMergeField: string = "";
  emailMergeField: string = "";
}

export class BroadcastMembers {

  selectionType: string = "ALL_MEMBERS";
  taskTeams: string[] = [];
  provinces: string[] = [];
  topics: string[] = [];

}

export class BroadcastCost {
  totalNumber: number = 999;
  smsNumber: number = 999;
  emailNumber: number = 999;
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
  fbPageNames: string[];
  postTwitter: boolean;
  twitterAccount: string;

  totalMemberCount: number;
  topics: string[];
  provinces: string[];

  sendTimeDescription: string;
  sendTime: string;

  broadcastCost: string;

}
