import {DateTimeUtils} from "../DateTimeUtils";

export class TaskInfo {

  constructor(public uid: string,
              public name: string,
              public type: string,
              public deadlineDate: Date) {
  }

  public getEventIconName(): string {

    if (this.type == "MEETING")
      return "icon_meeting.png";
    else if (this.type == "VOTE")
      return "icon_vote.png";
    else if (this.type == "TODO")
      return "icon_todo.png";
    else
      return "";
  }

  public static fromJson(json) {
    return new TaskInfo(
      json.taskUid,
      json.title,
      json.taskType,
      DateTimeUtils.getDateFromJavaInstant(json.deadlineTime)
    )
  }

}
