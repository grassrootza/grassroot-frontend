import {ManagedPage} from "../../user/model/integration-settings";

export class BroadcastParams {

  isSmsAllowed: boolean = true;
  smsCostCents: number = 0;

  isFbConnected: boolean = true;
  facebookPages: ManagedPage[] = [];

  isTwitterConnected: boolean = true;
  twitterAccount: ManagedPage = new ManagedPage();

  allMemberCount: number = 0; // may also have in group, but want precisely most recent

}
