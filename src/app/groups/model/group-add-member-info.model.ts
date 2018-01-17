import {GroupRole} from "./group-role";
import {UserProvince} from '../../user/model/user-province.enum';

export class GroupAddMemberInfo {


  constructor(public memberMsisdn: String = "",
              public displayName: String = "",
              public roleName: string = "ROLE_ORDINARY_MEMBER",
              public alernateNumbers: String[] = [],
              public emailAddress: String = "",
              public province: UserProvince = null,
              public affiliations: string[] = [],
              public taskTeams: string[] = [],
              public topics: string[] = []) {
  }

  public getFormattedRoleName(): string {
    return GroupRole[this.roleName];
  }
}
