import {User} from "../../user/user.model";
import {GroupInfo} from "./group-info.model";
import {GroupRole} from "./group-role";
import {PhoneNumberUtils} from "../../utils/PhoneNumberUtils";
import {UserProvince} from "../../user/model/user-province.enum";

export class MembershipInfo {

  constructor(public memberUid: string,
              public phoneNumber: string,
              public memberEmail: string,
              public province: string,
              public nationalFormattedNumber: string,
              public displayName: string,
              public roleName: GroupRole) {
  }
}

export const getUserFromMembershipInfo = (memb: MembershipInfo): User => {
  return new User(memb.memberUid, memb.displayName, memb.phoneNumber, memb.memberEmail, "", "", "true", "", memb.province, false, false);
};

export class Membership {

  constructor(public displayName:string,
              public selected: boolean,
              public user: User,
              public group: GroupInfo,
              public roleName: GroupRole,
              public topics: string[],
              public joinMethod: string,
              public joinMethodDescriptor: string,
              public affiliations: string[],
              public canEditDetails: boolean) {
  }

  public joinMethodKey(): string {
    return 'group.joinMethods.descriptors.' + this.joinMethod;
  }

  public iconClass(): string {
    switch (this.joinMethod) {
      case "BULK_IMPORT": return "fas fa-upload";
      case "ADDED_AT_CREATION": return "fas fa-users";
      case "ADDED_BY_OTHER_MEMBER": return "fas fa-user-plus";
      case "CAMPAIGN_GENERAL": return "fas fa-location-arrow";
      case "CAMPAIGN_PETITION": return "fas fa-location-arrow";
      case "FILE_IMPORT": return "fas fa-upload";
      case "COPIED_INTO_GROUP": return "fas fa-upload";
      default: return "fas fa-mobile-alt";
    }
  }

  public formattedProvince(): string {
    if (this.user.province) {
      return UserProvince[this.user.province];
    } else {
      return "UNKNOWN";
    }
  }

  public nationalNumber(): string {
    return PhoneNumberUtils.convertFromSystem(this.user.phoneNumber);
  }

  public static createInstance(membershipData: Membership): Membership {
    return new Membership(membershipData.displayName,false, membershipData.user, membershipData.group, GroupRole[<string>membershipData.roleName], membershipData.topics, membershipData.joinMethod, membershipData.joinMethodDescriptor, membershipData.affiliations, membershipData.canEditDetails);
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

  public getSelectedMembers(): Membership[] {
    return this.content.filter(membership => membership.selected);
  }

}

