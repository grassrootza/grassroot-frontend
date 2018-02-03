import {GroupRole} from "./group-role";
import {UserProvince} from '../../user/model/user-province.enum';

export class GroupAddMemberInfo {

  constructor(public phoneNumber: string = "",
              public displayName: string = "",
              public firstName: string = "",
              public surname: string = "",
              public roleName: string = GroupRole.ROLE_ORDINARY_MEMBER,
              public memberEmail: string = "",
              public province: UserProvince = null,
              public affiliations: string[] = [],
              public taskTeams: string[] = [],
              public topics: string[] = []) {
  }

  public getFormattedRoleName(): string {
    return GroupRole[this.roleName];
  }
}

export const getAddMemberInfo = (gami: GroupAddMemberInfo): GroupAddMemberInfo => {
  return new GroupAddMemberInfo(
    gami.phoneNumber,
    gami.displayName,
    gami.firstName,
    gami.surname,
    gami.roleName,
    gami.memberEmail,
    gami.province,
    gami.affiliations,
    gami.taskTeams,
    gami.topics);
};
