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
