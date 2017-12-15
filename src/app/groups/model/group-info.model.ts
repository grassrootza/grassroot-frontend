import {DateTimeUtils} from "../../DateTimeUtils";
import {TaskInfo} from "../../task/task-info.model";
import {GroupRef} from "./group-ref.model";
import {GroupRole} from "./group-role";
import {TaskType} from "../../task/task-type";
import {DatePipe} from "@angular/common";

export class GroupInfo {

  constructor(public name: string,
              public description: string,
              public memberCount: number,
              public uid: string,
              public permissions: string[],
              public role: GroupRole,
              public nextEventTime: any,
              public nextEventType: TaskType,
              public pinned: boolean,
              public tasks: TaskInfo[],
              public subGroups: GroupRef[]) {
  }

  public hasPermission(permission: string) {
    return this.permissions.indexOf(permission) >= 0;
  }

  public getFormattedRoleName(): string {
    return GroupRole[this.role];
  }

  public getFormattedEventTime(): string {
    if (this.nextEventTime != null)
      return new DatePipe("en").transform(this.nextEventTime,"d MMM y, hh:MM a");
    else return "";
  }

  public getEventIconName() {
    if (this.nextEventType != null) {
      if (this.nextEventType == TaskType.MEETING)
        return "icon_meeting.png";
      else if (this.nextEventType == TaskType.VOTE)
        return "icon_vote.png";
      else if (this.nextEventType == TaskType.TODO)
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

    let taskList: TaskInfo[] = [];
    for (let j in json.comingUpEvents) {
      let taskJson = json.comingUpEvents[j];
      taskList.push(TaskInfo.fromJson(taskJson));
    }

    let subGroupList: GroupRef[] = [];
    for (let j in json.subGroups) {
      let sgJson = json.subGroups[j];
      subGroupList.push(GroupRef.fromJson(sgJson));
    }

    return new GroupInfo(
      json.name,
      json.description,
      json.memberCount,
      json.groupUid,
      permissions,
      GroupRole[<string>json.userRole],
      json.nextEventTime ? DateTimeUtils.getDateFromJavaInstant(json.nextEventTime) : null,
      TaskType[<string>json.nextEventType],
      json.pinned,
      taskList,
      subGroupList
    );
  }

}
