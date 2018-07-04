import {DateTimeUtils} from "../../utils/DateTimeUtils";
import * as moment from "moment";
import {CampaignMsgServerDTO, getCampaignMsg} from "../campaign-create/campaign-request";
import {Language, MSG_LANGUAGES} from "../../utils/language";

export class CampaignInfo {

  constructor(public name: string,
              public campaignUid: string,
              public campaignType: string,
              public masterGroupName: string,
              public masterGroupUid: string,
              public description: string,
              public campaignStartDate: any,
              public campaignEndDate: any, // this is a moment
              public totalEngaged: number,
              public totalJoined: number,
              public creatingUserName: string,
              public creatingUserUid: string,
              public createdDate: any,
              public campaignCode: string,
              public joinTopics: string[],
              public textJoinWord: string,
              public campaignMessages: CampaignMsgServerDTO[],
              public outboundSmsEnabled: boolean,
              public outboundSmsLimit: number,
              public outboundSmsSpent: number,
              public outboundSmsUnitCost: number,
              public petitionConnected: boolean,
              public campaignUrl: string,
              public petitionUrl: string,
              public campaignImageKey: string,
              public defaultLanguage: string) {
  }

  public isActive(): boolean {
    return this.campaignEndDate.isAfter(moment());
  }

  public getLanguages(): Language[] {
    let languageCodes = new Set();
    this.campaignMessages.forEach(msgDto => {
      console.log("campaign message: ", msgDto);
      msgDto.messages.forEach(msg => languageCodes.add(msg.language))
    });
    console.log("extracted language codes: ", languageCodes);
    return MSG_LANGUAGES.filter(lang => languageCodes.has(lang.threeDigitCode));
  }

  public hasMessageType(messageType: string) {
    return this.campaignMessages.findIndex(msg => msg.linkedActionType == messageType) != -1;
  }
}

export const getCampaignEntity = (cp: CampaignInfo): CampaignInfo => {
  return new CampaignInfo(
    cp.name,
    cp.campaignUid,
    cp.campaignType,
    cp.masterGroupName,
    cp.masterGroupUid,
    cp.description,
    DateTimeUtils.getMomentFromJavaInstant(cp.campaignStartDate),
    DateTimeUtils.getMomentFromJavaInstant(cp.campaignEndDate),
    cp.totalEngaged,
    cp.totalJoined,
    cp.creatingUserName,
    cp.creatingUserUid,
    DateTimeUtils.getMomentFromJavaInstant(cp.createdDate),
    cp.campaignCode,
    cp.joinTopics,
    cp.textJoinWord,
    cp.campaignMessages ? cp.campaignMessages.map(getCampaignMsg) : [],
    cp.outboundSmsEnabled,
    cp.outboundSmsLimit,
    cp.outboundSmsSpent,
    cp.outboundSmsUnitCost,
    cp.petitionConnected,
    cp.campaignUrl,
    cp.petitionUrl,
    cp.campaignImageKey,
    cp.defaultLanguage
  );
};
