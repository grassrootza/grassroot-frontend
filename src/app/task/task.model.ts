import {TaskType} from "./task-type";
import {TodoType} from "./todo-type";

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
              public wholeGroupAssigned: boolean,
              public thisUserAssigned: boolean) {

    /**

     private final String taskUid;

     private final String title;
     private String description;
     private String location;

     private final String createdByUserName;
     private final boolean createdByThisUser;

     private final TaskType type;

     private final String parentUid;
     private final String parentName;
     private final String ancestorGroupName;

     private final Long createdTimeMillis;
     private final Long deadlineMillis;
     private final Long lastServerChangeMillis;

     private final boolean wholeGroupAssigned;
     private final boolean thisUserAssigned;

     private final String userResponse;
     private final boolean hasResponded;
     private final boolean canEdit;

     @Setter private Map<String, Long> voteResults;

     */
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
      taskData.wholeGroupAssigned,
      taskData.thisUserAssigned
    )
  }




}
