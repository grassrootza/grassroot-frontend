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

  selectionType: String = "allMembers";
  subgroups: String[] = [];
  provinces: String[] = [];
  topics: String[] = [];

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

  selectionType: String = "allMembers";
  taskTeams: String[] = [];
  provinces: String[] = [];
  topics: String[] = [];

}

export class BroadcastSchedule {

  sendNow: boolean = true;
  sendOnJoin: boolean = false;
  sendAtTime: boolean = false;
  sendDate: String = Date();

}

export class BroadcastConfirmation {

  sendShortMessage: boolean;
  sendShortMessageCount: number;
  sendEmail: boolean;
  postFacebook: boolean;
  facebookPage: String;
  postTwitter: boolean;
  twitterAccount: String;

  totalMemberCount: number;
  topics: String[];
  provinces: String[];

  sendTime: String;

}
