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

  allMembers: boolean = true;
  subgroups: String[];
  provinces: String[];
  topics: String[];

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

  // todo : think of best way to handle possible complexity
  allMembers: boolean = false;
  taskTeams: String[];
  provinces: String[];
  topics: String[];

}
