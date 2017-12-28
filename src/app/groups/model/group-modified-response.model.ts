import {GroupRole} from "./group-role";
import {DatePipe} from "@angular/common";
import {MembershipInfo} from "./membership.model";
import {GroupRef} from "./group-ref.model";

export class GroupModifiedResponse {


  constructor(public membersAdded: number,
              public invalidNumbers: String[]) {
  }
}
