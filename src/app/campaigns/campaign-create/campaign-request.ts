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

  constructor(public linkedActionType: string,
              public messages: Map<string, string> = new Map<string, string>(),
              public tags: string[] = []) {}

}

export class CampaignMsgServerReq {

  linkedActionType: string;
  messages: CampaignMsgPair[];
  tags: string[];

  constructor(linkedActionType: string,
              messageMap: Map<string, string>,
              tags: string[] = []) {
    this.linkedActionType = linkedActionType;
    this.tags = tags;
    this.messages = Array.from(messageMap.keys()).map(key => new CampaignMsgPair(messageMap.get(key), key));
  }


}


export class CampaignMsgPair {
  constructor(public message: string,
              public language: string) { // three digit term
  }
}
