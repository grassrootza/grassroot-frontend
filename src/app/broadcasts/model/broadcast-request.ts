export class BroadcastRequest {

  type: String;
  parentId: String;

  title: String = "";

  sendShortMessages: boolean = false;
  shortMessageString: String = "";

  sendEmail: boolean = false;
  emailContent: String = "";

  postToFacebook: boolean = false;
  facebookPage: String = "";
  facebookContent: String = "";
  facebookLink: String = "";

  postToTwitter: boolean = false;
  twitterAccount: String = "";
  twitterContent: String = "";
  twitterLink: String = "";

  selectionType: String = "ALL_MEMBERS";
  subgroups: String[] = [];
  provinces: String[] = [];
  topics: String[] = [];

  sendType: String = "SEND_NOW";
  sendNow: boolean = true;
  sendOnJoin: boolean = false;
  sendAtTime: boolean = false;
  sendDate: String = Date();

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

  checkTypesSet() {
    return this.sendShortMessages || this.sendEmail || this.postToFacebook || this.postToTwitter;
  }

  checkContentSet() {
    return (this.sendShortMessages && this.shortMessageString != "") ||
      (this.sendEmail && this.emailContent != "") ||
      (this.postToFacebook && this.facebookContent != "") ||
      (this.postToTwitter && this.twitterContent != "");
  }

}

export class BroadcastTypes {

  shortMessage: boolean = false;
  email: boolean = false;
  facebook: boolean = false;
  facebookPage: String = "";
  twitter: boolean = false;
  twitterAccount: String = "";

}

export class BroadcastContent {

  // todo: images and file attachments
  title: String = "";
  shortMessage: String = "";
  emailContent: String = "";
  facebookPost: String = "";
  facebookLink: String = "";
  twitterPost: String = "";
  twitterLink: String = "";

}

export class BroadcastMembers {

  selectionType: String = "ALL_MEMBERS";
  taskTeams: String[] = [];
  provinces: String[] = [];
  topics: String[] = [];

}

export class BroadcastSchedule {

  sendType: String = "SEND_NOW";
  sendNow: boolean = true;
  sendOnJoin: boolean = false;
  sendAtTime: boolean = false;
  sendDate: String = Date();

}

export class BroadcastConfirmation {

  sendShortMessage: boolean;
  sendShortMessageCount: number;
  sendEmail: boolean;
  sendEmailCount: number;
  postFacebook: boolean;
  facebookPage: String;
  postTwitter: boolean;
  twitterAccount: String;

  totalMemberCount: number;
  topics: String[];
  provinces: String[];

  sendTime: String;
  sendTimeDescription: String;

}
