import {MembershipInfo} from "./membership.model";

export class GroupRef {

  constructor(public groupUid: string,
              public name: string,
              public memberCount: number) {
  }

}

export class GroupMembersRef {
  constructor(public groupUid: string,
              public name: string,
              public memberCount: number,
              public members: MembershipInfo[]) {

  }

  public hasMember(memberUid: string) {
    return !!this.members && this.members.findIndex(m => m.memberUid === memberUid) != -1;
  }
}

export const getGroupMembersEntity = (gm: GroupMembersRef) => {
  return new GroupMembersRef(gm.groupUid, gm.name, gm.memberCount, gm.members);
};

export const getGroupMembersList = (gms: GroupMembersRef[]) => {
  if (gms) {
    return gms.map(gm => getGroupMembersEntity(gm));
  } else {
    return [];
  }
};
