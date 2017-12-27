import {GroupRole} from "./group-role";
import {DatePipe} from "@angular/common";
import {MembershipInfo} from "./membership.model";
import {GroupRef} from "./group-ref.model";

export class GroupAddMemberInfo {


  constructor(public memberMsisdn: String,
              public displayName: String,
              public roleName: GroupRole,
              public alernateNumbers: String[],
              public emailAddress: String) {
  }
}
