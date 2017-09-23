import {User} from "../user/user.model";

export class Group {

  constructor(public name: string,
              public description: string,
              public creator: string,
              public memberCount: number,
              public uid: string,
              public hasTasks: boolean,
              public joinCode: string,
              public lastChangeDescription: string,
              public lastChangeType: string,
              public lastMajorChangeMillis: number,
              public members: User[],
              public paidFor: boolean,
              public permissions: string[],
              public role: string) {
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
      json.groupName,
      json.description,
      json.groupCreator,
      json.groupMemberCount,
      json.groupUid,
      json.hasTasks,
      json.joinCode,
      json.lastChangeDescription,
      json.lastChangeType,
      json.lastMajorChangeMillis,
      members,
      json.paidFor,
      permissions,
      json.role
    );
  }

}
