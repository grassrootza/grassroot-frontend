import {DateTimeUtils} from "../DateTimeUtils";
import {TaskType} from "./task-type";

export class TaskInfo {

  constructor(public uid: string,
              public name: string,
              public type: TaskType,
              public deadlineDate: Date) {
  }

  public getEventIconName(): string {


    if (this.type == TaskType.MEETING)
      return "icon_meeting.png";
    else if (this.type == TaskType.VOTE)
      return "icon_vote.png";
    else if (this.type == TaskType.TODO)
      return "icon_todo.png";
    else
      return "";
  }

  public static fromJson(json) {
    return new TaskInfo(
      json.taskUid,
      json.title,
      TaskType[<string>json.taskType],
      DateTimeUtils.getDateFromJavaInstant(json.deadlineTime)
    )
  }

}
