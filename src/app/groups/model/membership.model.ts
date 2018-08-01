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

export const getMemberFromMembershipInfo = (memb: MembershipInfo): Membership => {
  return new Membership(memb.displayName, false, memb.memberUid, memb.province, memb.phoneNumber, memb.memberEmail,
    memb.roleName, [], '', '', [], false);
}

export class Membership {

  constructor(public displayName:string,
              public selected: boolean,
              public userUid: string,
              public province: string,
              public phoneNumber: string,
              public emailAddress: string, 
              public roleName: GroupRole,
              public topics: string[],
              public joinMethod: string,
              public joinMethodDescriptor: string,
              public affiliations: string[],
              public canEditDetails: boolean,
              public contactError?: boolean,
              public groupName?: string) { // note we only use group name on front page, else don't expect it to be there
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
    if (this.province) {
      return UserProvince[this.province];
    } else {
      return "UNKNOWN";
    }
  }

  public nationalNumber(): string {
    return PhoneNumberUtils.convertFromSystem(this.phoneNumber);
  }

  public static createInstance(m: Membership): Membership {
    return new Membership(m.displayName,false, m.userUid, m.province, m.phoneNumber, m.emailAddress,
      GroupRole[<string>m.roleName], m.topics, m.joinMethod, m.joinMethodDescriptor, m.affiliations, m.canEditDetails, 
      m.contactError, m.groupName);
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

export const transformMemberPage = (result: MembersPage): MembersPage => {
  let transformedContent = result.content.map(m => Membership.createInstance(m));
  return new MembersPage(
    result.number,
    result.totalPages,
    result.totalElements,
    result.size,
    result.first,
    result.last,
    transformedContent
  )
}

