import {TaskInfo} from "../../task/task-info.model";
import {GroupRef} from "./group-ref.model";
import {GroupRole} from "./group-role";
import {TaskType} from "../../task/task-type";
import {DatePipe} from "@angular/common";

export class GroupInfo {

  constructor(public name: string,
              public description: string,
              public memberCount: number,
              public groupUid: string,
              public userPermissions: string[],
              public userRole: GroupRole,
              public nextEventTime: Date,
              public nextEventType: TaskType,
              public pinned: boolean,
              public comingUpEvents: TaskInfo[],
              public subGroups: GroupRef[]) {
  }


  public hasPermission(permission: string) {
    return this.userPermissions.indexOf(permission) >= 0;
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



}
