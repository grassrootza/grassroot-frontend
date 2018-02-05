import {ManagedPage} from "../../user/model/integration-settings";

export class BroadcastParams {

  broadcastId: string = "";

  isSmsAllowed: boolean = true;
  smsCostCents: number = 0;

  fbConnected: boolean = true;
  facebookPages: ManagedPage[] = [];

  twitterConnected: boolean = true;
  twitterAccount: ManagedPage = new ManagedPage();

  allMemberCount: number = 0; // may also have in group, but want precisely most recent

  campaignLinks: Map<String, String> = new Map();

}

export const getBroadcastParams = (bp: BroadcastParams): BroadcastParams => {
  let params = new BroadcastParams();
  params.broadcastId = bp.broadcastId;
  params.isSmsAllowed = bp.isSmsAllowed;
  params.smsCostCents = bp.smsCostCents;
  params.fbConnected = bp.fbConnected;
  params.facebookPages = bp.facebookPages;
  params.twitterConnected = bp.twitterConnected;
  params.allMemberCount = bp.allMemberCount;
  params.campaignLinks = bp.campaignLinks;
  return params;
};
