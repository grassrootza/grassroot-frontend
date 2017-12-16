import {TaskType} from "./task-type";

export class TaskInfo {

  constructor(public taskUid: string,
              public title: string,
              public taskType: TaskType,
              public deadlineTime: Date) {
  }

  public getEventIconName(): string {


    if (this.taskType == TaskType.MEETING)
      return "icon_meeting.png";
    else if (this.taskType == TaskType.VOTE)
      return "icon_vote.png";
    else if (this.taskType == TaskType.TODO)
      return "icon_todo.png";
    else
      return "";
  }

}
