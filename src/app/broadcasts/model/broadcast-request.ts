import {DateTimeUtils} from "../../utils/DateTimeUtils";
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {MembersFilter} from "../../groups/member-filter/filter.model";
import {JoinDateCondition} from "../../groups/member-filter/joindatecondition.enum";
import * as moment from 'moment-mini-ts';
import {Moment} from 'moment-mini-ts';

export class BroadcastRequest {

  broadcastId: string;
  type: string;
  parentId: string;

  title: string = "";

  sendShortMessages: boolean = false;
  shortMessageString: string = "";

  sendEmail: boolean = false;
  emailContent: string = "";
  emailAttachmentKeys: string[] = [];

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
  taskTeams: string[] = [];
  provinces: string[] = [];
  noProvince: boolean = null;
  affiliations: string[] = null;
  joinMethods: string[] = null;
  topics: string[] = [];
  joinDate: string = null;
  joinDateCondition: JoinDateCondition = null;
  filterNamePhoneEmail: string = "";
  skipSmsIfEmail: boolean = false;

  sendType: string = "IMMEDIATE"; // options: IMMEDIATE, FUTUREADDED_TO_GROUP
  sendNow: boolean = true;
  sendOnJoin: boolean = false;
  sendAtTime: boolean = false;

  sendDateString: string = "";
  sendDateTimeMillis: number = moment().valueOf();

  clear() {
    this.broadcastId = "";
    this.type = "";
    this.parentId = "";
    this.title = "";
    this.sendShortMessages = false;
    this.shortMessageString = "";
    this.sendEmail = false;
    this.emailContent = "";
    this.emailAttachmentKeys = [];
    this.postToFacebook = false;
    this.facebookPages = [];
    this.facebookContent = "";
    this.facebookLink = "";
    this.postToTwitter = false;
    this.twitterContent = "";
    this.provinces = [];
    this.topics = [];

    this.selectionType = "ALL_MEMBERS";
    this.taskTeams = [];
    this.provinces = [];
    this.noProvince = null;
    this.topics = [];
    this.affiliations = [];
    this.joinMethods = [];
    this.joinDate = null;
    this.joinDateCondition = null;
    this.filterNamePhoneEmail = "";
    this.skipSmsIfEmail = false;

    this.sendType = "IMMEDIATE"; // options: IMMEDIATE, FUTUREADDED_TO_GROUP
    this.sendNow = true;
    this.sendOnJoin = false;
    this.sendAtTime = false;
    this.sendDateString = "";

    this.sendDateTimeMillis = moment().valueOf();
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
    this.emailAttachmentKeys = br.emailAttachmentKeys;
    this.postToFacebook = br.postToFacebook;
    this.facebookPages = br.facebookPages;
    this.facebookContent = br.facebookContent;
    this.facebookLink = br.facebookLink;
    this.postToTwitter = br.postToTwitter;
    this.twitterContent = br.twitterContent;
    this.provinces = br.provinces;
    this.topics = br.topics;

    this.selectionType = br.selectionType;
    this.taskTeams = br.taskTeams;
    this.provinces = br.provinces;
    this.noProvince = br.noProvince;
    this.topics = br.topics;
    this.filterNamePhoneEmail = br.filterNamePhoneEmail;

    this.sendType = br.sendType; // options: IMMEDIATE, FUTUREADDED_TO_GROUP
    this.sendNow = br.sendNow;
    this.sendOnJoin = br.sendOnJoin;
    this.sendAtTime = br.sendAtTime;
    this.sendDateString = br.sendDateString;

    this.sendDateTimeMillis = br.sendDateTimeMillis;
  }

  setMemberFilter(selectionType: string, filter: MembersFilter) {
    this.selectionType = selectionType;
    this.topics = filter.topics;
    this.provinces = filter.provinces;
    this.noProvince = filter.noProvince && filter.noProvince == 'UNKNOWN';
    this.taskTeams = filter.taskTeams;
    this.affiliations = filter.affiliations;
    this.joinMethods = filter.joinSources;
    this.joinDateCondition = filter.joinDateCondition;
    this.joinDate = !!(filter.joinDate) ? filter.joinDate.format("YYYY-MM-DD") : null;
    this.filterNamePhoneEmail = filter.namePhoneOrEmail;
    console.log("just set member filter, looks like: ", this);
  }

  getMemberFilter(): MembersFilter {
    let filter = new MembersFilter();
    filter.topics = this.topics;
    filter.provinces = this.provinces;
    filter.noProvince = this.noProvince ? 'UNKNOWN' : null;
    filter.taskTeams = this.taskTeams;
    filter.affiliations = this.affiliations;
    filter.joinSources = this.joinMethods;
    filter.joinDateCondition = this.joinDateCondition;
    filter.joinDate = moment(this.joinDate, "YYYY-MM-DD");
    filter.namePhoneOrEmail = this.filterNamePhoneEmail;
    return filter;
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
  emailAttachmentKeys: string[] = [];
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
  memberFilter: MembersFilter;
  skipSmsIfEmail: boolean = false;

}

export class BroadcastCost {
  totalNumber: number = 999;
  smsNumber: number = 999;
  emailNumber: number = 999;
  broadcastCost: string = "0.00";
}

export class BroadcastSchedule {

  sendType: string = "IMMEDIATE";

  sendMoment: Moment = null;
  sendDateString: string = null;
  sendDateTimeMillis: number = null;

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
  sendDateString: string;

  broadcastCost: string;

}
