import {User} from "../../user/user.model";
import {GroupInfo} from "./group-info.model";
import {GroupRole} from "./group-role";

export class MembershipInfo {

  constructor(public memberUid: string,
              public phoneNumber: string,
              public nationalFormattedNumber: string,
              public displayName: string,
              public roleName: GroupRole) {
  }
}


export class Membership {

  constructor(public selected: boolean,
              public user: User,
              public group: GroupInfo,
              public roleName: GroupRole,
              public topics: string[],
              public joinMethod: string,
              public joinMethodDescriptor: string) {
  }

  public joinMethodKey(): string {
    return 'group.joinMethods.descriptors.' + this.joinMethod;
  }

}


export class MembersPage {

  constructor(public number: number,
              public totalPages: number,
              public totalElements: number,
              public size: number,
              public first: boolean,
              public last: boolean,
              public content: Membership[]) {
  }

}

