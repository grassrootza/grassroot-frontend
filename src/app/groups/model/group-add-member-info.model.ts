import {GroupRole} from "./group-role";

export class GroupAddMemberInfo {


  constructor(public memberMsisdn: String = "",
              public displayName: String = "",
              public roleName: string = "ROLE_ORDINARY_MEMBER",
              public alernateNumbers: String[] = [],
              public emailAddress: String = "",
              public province: string = "",
              public affiliation: string = "",
              public taskTeam: string = "",
              public topic: string = "") {
  }

  public getFormattedRoleName(): string {
    return GroupRole[this.roleName];
  }
}
