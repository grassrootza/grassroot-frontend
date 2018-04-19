import {FacebookPage, ManagedPage} from "../../user/model/integration-settings";

export class BroadcastParams {

  broadcastId: string = "";

  smsAllowed: boolean = true;
  smsCostCents: number = 0;

  fbConnected: boolean = true;
  facebookPages: FacebookPage[] = [];

  twitterConnected: boolean = true;
  twitterAccount: ManagedPage = new ManagedPage();

  allMemberCount: number = 0; // may also have in group, but want precisely most recent

  campaignLinks: Map<String, String> = new Map();
  mergeFields: string[];

  getFbPageNames(): string[] {
    return this.facebookPages.map(page => page.pageName);
  }

}

export const getBroadcastParams = (bp: BroadcastParams): BroadcastParams => {
  let params = new BroadcastParams();
  params.broadcastId = bp.broadcastId;
  params.smsAllowed = bp.smsAllowed;
  params.smsCostCents = bp.smsCostCents;
  params.fbConnected = bp.fbConnected;
  params.facebookPages = bp.facebookPages;
  params.twitterConnected = bp.twitterConnected;
  params.twitterAccount = bp.twitterAccount;
  params.allMemberCount = bp.allMemberCount;
  params.campaignLinks = bp.campaignLinks;
  params.mergeFields = bp.mergeFields;
  return params;
};
