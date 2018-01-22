import {GroupRole} from "./group-role";
import {DatePipe} from "@angular/common";
import {MembershipInfo} from "./membership.model";
import {GroupRef} from "./group-ref.model";
import {JoinCodeInfo} from "./join-code-info";

export class Group {

  public formattedCreationTime: string = "";

  constructor(public groupUid: string,
              public name: string,
              public description: string,
              public groupCreatorUid: string,
              public groupCreatorName: string,
              public groupCreationTimeMillis: number,
              public groupCreationTime: Date,
              public discoverable: boolean,
              public memberCount: number,
              public joinCode: string,
              public lastChangeDescription: string,
              public lastChangeType: string,
              public lastMajorChangeMillis: number,
              public members: MembershipInfo[],
              public paidFor: boolean,
              public userPermissions: string[],
              public userRole: string,
              public subGroups: GroupRef[],
              public topics: string[],
              public joinWords: JoinCodeInfo[],
              public joinWordsLeft: number,
              public reminderMinutes: number,
              public profileImageUrl: string) {
    this.formattedCreationTime = new DatePipe("en").transform(this.groupCreationTime, "dd MMM, y");
  }

  public hasPermission(permission: string) {
    return this.userPermissions.indexOf(permission) >= 0;
  }

  public getFormattedRoleName(): string {
    return GroupRole[this.userRole];
  }

  public hasProfileImage(): boolean {
    return !!this.profileImageUrl;
  }

  public joinWordsExtracted(): string[] {
    return this.joinWords.map(jw => jw.word);
  }

}

