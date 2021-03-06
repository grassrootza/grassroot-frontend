import {TaskType} from "./task-type";
import {TodoType} from "./todo-type";
import * as moment from 'moment-mini-ts';

export class Task {

  constructor(public taskUid: string,
              public title: string,
              public type: TaskType,
              public deadlineMillis: number,
              public deadlineDate: Date,
              public description: string,
              public location: string,
              public parentUid: string,
              public parentName: string,
              public ancestorGroupName: string,
              public todoType: TodoType,
              public hasResponded: boolean,
              public userResponse: string,
              public wholeGroupAssigned: boolean,
              public thisUserAssigned: boolean,
              public createdByUserName:string,
              public createdByUserPhone:string,
              public emailAddress:string,
              public createdByThisUser: boolean,
              public canEdit: boolean,
              public voteOptions: string[],
              public voteResults: Map<string, string>,
              public errorReport: boolean,
              public meetingImportance:any) {
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

  public isActive(): boolean {
    return this.deadlineMillis > moment().valueOf();
  }

  public fetchVoteOptions() {
    return this.voteOptions ? this.voteOptions : ['YES', 'NO', 'ABSTAIN'];
  }

  public static createInstanceFromData(taskData: Task) {
    return new Task(
      taskData.taskUid,
      taskData.title,
      taskData.type = TaskType[<string>taskData.type],
      taskData.deadlineMillis,
      new Date(taskData.deadlineMillis),
      taskData.description,
      taskData.location,
      taskData.parentUid,
      taskData.parentName,
      taskData.ancestorGroupName,
      taskData.todoType != null ? TodoType[<string>taskData.todoType] : null,
      taskData.hasResponded,
      taskData.userResponse,
      taskData.wholeGroupAssigned,
      taskData.thisUserAssigned,
      taskData.createdByUserName,
      taskData.createdByUserPhone,
      taskData.emailAddress,
      taskData.createdByThisUser,
      taskData.canEdit,
      taskData.voteOptions,
      taskData.voteResults,
      taskData.errorReport,
      taskData.meetingImportance
    )
  }

}
