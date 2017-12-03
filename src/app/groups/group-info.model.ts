import {DateTimeUtils} from "../DateTimeUtils";

export class GroupInfo {

  constructor(public name: string,
              public description: string,
              public memberCount: number,
              public uid: string,
              public permissions: string[],
              public role: string,
              public nextEventTime: any,
              public nextEventType: string,
              public pinned: boolean) {
  }

  public hasPermission(permission: string) {
    return this.permissions.indexOf(permission) >= 0;
  }

  public getFormattedRoleName(): string {
    if (this.role != null)
      return this.role.substring(11);
    else return this.role;
  }

  public getFormattedEventTime(): string {
    if (this.nextEventTime != null)
      return this.nextEventTime.toLocaleString();
    else return "";
  }

  public getEventIconName() {
    if (this.nextEventType != null) {
      if (this.nextEventType == "MEETING")
        return "icon_meeting.png";
      else if (this.nextEventType == "VOTE")
        return "icon_vote.png";
      else if (this.nextEventType == "TODO")
        return "icon_todo.png";
    }
    return "";
  }

  static fromJson(json): GroupInfo {

    let permissions: string[] = [];

    for (let i in json.userPermissions) {
      let permissionJson = json.userPermissions[i];
      permissions.push(permissionJson);
    }

    return new GroupInfo(
      json.name,
      json.description,
      json.memberCount,
      json.groupUid,
      permissions,
      json.userRole,
      json.nextEventTime ? DateTimeUtils.getDateFromEpochSeconds(json.nextEventTime.epochSecond) : null,
      json.nextEventType,
      json.pinned
    );
  }

}
