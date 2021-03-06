import {DatePipe} from "@angular/common";
import {MembershipInfo} from "./membership.model";
import {getGroupMembersList, GroupMembersRef} from "./group-ref.model";
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
              public subGroups: GroupMembersRef[],
              public topics: string[],
              public affiliations: string[],
              public joinWords: JoinCodeInfo[],
              public joinWordsLeft: number,
              public joinTopics: string[],
              public reminderMinutes: number,
              public profileImageUrl: string,
              public hasInboundMessages: boolean,
              public hidden: boolean) {
    this.formattedCreationTime = new DatePipe("en").transform(this.groupCreationTime, "dd MMM, y");
  }

  public hasPermission(permission: string) {
    return this.userPermissions.indexOf(permission) >= 0;
  }


  public hasProfileImage(): boolean {
    return !!this.profileImageUrl;
  }

  public joinWordsExtracted(): string[] {
    return this.joinWords.map(jw => jw.word);
  }

  public isJoinTopic(topic: string): boolean {
    return this.joinTopics && this.joinTopics.length > 0 && this.joinTopics.indexOf(topic) != -1;
  }

  public canDeactivate(): boolean {
    const monthAgo = new Date().getTime() - (1 * 24 * 60 * 60 * 1000);
    return this.userRole === 'ROLE_GROUP_ORGANIZER' && (this.memberCount < 5 || this.groupCreationTimeMillis > monthAgo);
  }

}

export const getGroupEntity = (gr: Group): Group => {
  return new Group(
    gr.groupUid,
    gr.name,
    gr.description,
    gr.groupCreatorUid,
    gr.groupCreatorName,
    gr.groupCreationTimeMillis,
    new Date(gr.groupCreationTimeMillis),
    gr.discoverable,
    gr.memberCount,
    gr.joinCode,
    gr.lastChangeDescription,
    gr.lastChangeType,
    gr.lastMajorChangeMillis,
    gr.members,
    gr.paidFor,
    gr.userPermissions,
    gr.userRole,
    getGroupMembersList(gr.subGroups),
    gr.topics,
    gr.affiliations,
    gr.joinWords,
    gr.joinWordsLeft,
    gr.joinTopics,
    gr.reminderMinutes,
    gr.profileImageUrl,
    gr.hasInboundMessages,
    gr.hidden
  );
};
