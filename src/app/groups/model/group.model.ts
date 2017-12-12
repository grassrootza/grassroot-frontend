import {User} from "../../user/user.model";
import {GroupRole} from "./group-role";
import {DatePipe} from "@angular/common";

export class Group {

  public formattedCreationTime: string = "";

  constructor(public uid: string,
              public name: string,
              public description: string,
              public creatorUid: string,
              public creatorName: string,
              public creationTime: Date,
              public discoverable: boolean,
              public memberCount: number,
              public hasTasks: boolean,
              public joinCode: string,
              public lastChangeDescription: string,
              public lastChangeType: string,
              public lastMajorChangeMillis: number,
              public members: User[],
              public paidFor: boolean,
              public permissions: string[],
              public role: string) {
    this.formattedCreationTime = new DatePipe("en").transform(this.creationTime, "dd MMM, y");
  }

  public hasPermission(permission: string) {
    return this.permissions.indexOf(permission) >= 0;
  }

  static fromJson(json): Group {

    let members: User[] = [];
    let permissions: string[] = [];

    for (let i in json.members) {
      let userJson = json.members[i];
      members.push(User.fromJson(userJson));
    }

    for (let i in json.permissions) {
      let permissionJson = json.permissions[i];
      permissions.push(permissionJson);
    }

    return new Group(
      json.groupUid,
      json.name,
      json.description,
      json.groupCreatorUid,
      json.groupCreatorName,
      new Date(json.groupCreationTimeMillis),
      json.discoverable,
      json.groupMemberCount,
      json.hasTasks,
      json.joinCode,
      json.lastChangeDescription,
      json.lastChangeType,
      json.lastMajorChangeMillis,
      members,
      json.paidFor,
      permissions,
      json.userRole
    );
  }

  public getFormattedRoleName(): string {
    return GroupRole[this.role];
  }

}
