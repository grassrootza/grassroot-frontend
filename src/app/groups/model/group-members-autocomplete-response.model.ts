import {GroupRole} from "./group-role";
import {DatePipe} from "@angular/common";
import {MembershipInfo} from "./membership.model";
import {GroupRef} from "./group-ref.model";
import {JoinCodeInfo} from "./join-code-info";

export class GroupMembersAutocompleteResponse {


  constructor(public value: string,
              public label: string) {
  }


}

