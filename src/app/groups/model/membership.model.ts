import {User} from "../../user/user.model";
import {GroupInfo} from "./group-info.model";

export class MembershipInfo {

  constructor(public memberUid: string,
              public phoneNumber: string,
              public nationalFormattedNumber: string,
              public displayName: string,
              public roleName: string) {
  }
}


export class Membership {

  constructor(public user: User,
              public group: GroupInfo,
              public roleName: string) {
  }
}


export class MembersPage {

  constructor(public number: number,
              public totalPages: number,
              public size: number,
              public first: boolean,
              public last: boolean,
              public content: Membership[]) {
  }
}
