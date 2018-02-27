import {Language} from "../../utils/language";

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
  joinTopics: string[] = [];

  imageKey: string = "";
}

export class CampaignMsgRequest {
  constructor(public messageId: string,
              public linkedActionType: string,
              public messages: Map<string, string> = new Map<string, string>(),
              public nextMsgIds: string[] = [],
              public tags: string[] = []) {}
}

export class CampaignMsgServerDTO {

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

  getMessage(lang: Language): string {
    if (this.messages) {
      let msgIndex = this.messages.findIndex(msg => msg.language == lang.threeDigitCode);
      if (msgIndex != -1) {
        return this.messages[msgIndex].message;
      }
    }
    return '';
  }

  getMessageMap(): Map<string, string> {
    let msgMap = new Map();
    if (this.messages) {
      this.messages.forEach(msg => msgMap.set(msg.language, msg.message));
    }
    return msgMap;
  }
}

export class CampaignMsgPair {
  constructor(public message: string,
              public language: string) { // three digit term
  }
}

export const getCampaignMsg = (cm: CampaignMsgServerDTO): CampaignMsgServerDTO => {
  let cmDTO = new CampaignMsgServerDTO(
    cm.messageId,
    cm.linkedActionType,
    new Map<string, string>(),
    cm.nextMsgIds,
    cm.tags
  );
  cmDTO.messages = cm.messages;
  return cmDTO;
};
