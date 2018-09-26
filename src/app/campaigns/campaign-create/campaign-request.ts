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
              public channel: string = 'USSD',
              public messages: Map<string, string> = new Map<string, string>(),
              public nextMsgIds: string[] = [],
              public tags: string[] = []) {

  }

  messagesComplete(reqLanguages: Language[]) {
    return reqLanguages.every(lang => this.messages.has(lang.threeDigitCode) && !!this.messages.get(lang.threeDigitCode));
  }

  isForChannel(channel: string) {
    return this.channel == channel;
  }
}

export class CampaignMsgServerDTO {

  messageId: string;
  linkedActionType: string;
  channel: string;
  messages: CampaignMsgPair[];
  nextMsgIds: string[];
  tags: string[];

  constructor(messageId: string,
              linkedActionType: string,
              channel: string,
              messageMap: Map<string, string>,
              nextMsgIds: string[],
              tags: string[] = []) {
    this.messageId = messageId;
    this.linkedActionType = linkedActionType;
    this.channel = channel;
    this.tags = tags;
    this.messages = Array.from(messageMap.keys()).map(key => new CampaignMsgPair(messageMap.get(key), key));
    this.nextMsgIds = nextMsgIds;
  }

  getMessageMap(): Map<string, string> {
    let msgMap = new Map();
    if (this.messages) {
      this.messages.forEach(msg => msgMap.set(msg.language, msg.message));
    }
    return msgMap;
  }

  isForChannel(channel: string) {
    return this.channel == channel;
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
    cm.channel,
    new Map<string, string>(),
    cm.nextMsgIds,
    cm.tags
  );
  cmDTO.messages = cm.messages;
  return cmDTO;
};

export interface CampaignUpdateParams {
  name?: string, description?: string, mediaFileUid?: string, removeImage?: boolean, campaignType?: string,
  endDateMillis?: number, newCode?: string, textWord?: string, newMasterGroupUid?: string, joinTopics?: string[],
  landingUrl?: string, petitionApi?: string
}
