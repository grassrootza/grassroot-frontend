import {ManagedPage} from "../../user/model/integration-settings";

export class BroadcastParams {

  isSmsAllowed: boolean = true;
  smsCostsCents: number = 0;

  isFbConnected: boolean = true;
  facebookPages: ManagedPage[] = [];

  isTwitterConnected: boolean = true;
  twitterAccount: ManagedPage;

}
