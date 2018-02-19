import {DateTimeUtils} from "../../utils/DateTimeUtils";
import * as moment from "moment";
import {CampaignMsgServerDTO, getCampaignMsg} from "../campaign-create/campaign-request";

export class CampaignInfo {

  constructor(public name: string,
              public campaignUid: string,
              public campaignType: string,
              public masterGroupName: string,
              public masterGroupUid: string,
              public description: string,
              public campaignStartDate: any,
              public campaignEndDate: any,
              public totalEngaged: number,
              public totalJoined: number,
              public creatingUserName: string,
              public creatingUserUid: string,
              public createdDate: any,
              public campaignCode: number,
              public campaignTags: string[],
              public campaignMessages: CampaignMsgServerDTO[]) {
  }

  public isActive(): boolean {
    return this.campaignEndDate.isAfter(moment());
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
    cp.campaignTags,
    cp.campaignMessages ? cp.campaignMessages.map(getCampaignMsg) : []
  );
};
