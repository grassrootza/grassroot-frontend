import {User} from "../../user/user.model";
import {GroupInfo} from "./group-info.model";
import {GroupRole} from "./group-role";
import {PhoneNumberUtils} from "../../utils/PhoneNumberUtils";
import {UserProvince} from "../../user/model/user-province.enum";

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

  public formattedProvince(): string {
    if (this.user.province) {
      return UserProvince[this.user.province];
    } else {
      return "Unknown";
    }
  }

  public nationalNumber(): string {
    return PhoneNumberUtils.convertFromSystem(this.user.phoneNumber);
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

