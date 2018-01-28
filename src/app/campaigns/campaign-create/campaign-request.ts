export class CampaignRequest {

  name: string = "";
  code: string = "";
  description: string = "";
  startDateEpochMillis: number;
  endDateEpochMillis: number;
  type: string = "";
  amandlaUrl: string = "";
  groupUid: string;
  groupName: string;
  smsShare: boolean;
  smsLimit: number;
  landingPage: string = "";
  landingUrl: string = "";

  imageKey: string = "";
}

export class CampaignMsgRequest {

  constructor(public messageId: string,
              public linkedActionType: string,
              public messages: Map<string, string> = new Map<string, string>(),
              public nextMsgIds: string[] = [],
              public tags: string[] = []) {}

}

export class CampaignMsgServerReq {

  messageId: string;
  linkedActionType: string;
  messages: CampaignMsgPair[];
  nextMsgIds: string[];
  tags: string[];

  constructor(messageId: string,
              linkedActionType: string,
              messageMap: Map<string, string>,
              nextMsgIds: string[],
              tags: string[] = []) {
    this.messageId = messageId;
    this.linkedActionType = linkedActionType;
    this.tags = tags;
    this.messages = Array.from(messageMap.keys()).map(key => new CampaignMsgPair(messageMap.get(key), key));
    this.nextMsgIds = nextMsgIds;
  }


}

export class CampaignMsgPair {
  constructor(public message: string,
              public language: string) { // three digit term
  }
}