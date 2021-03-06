import {DatePipe} from '@angular/common';

export class GroupMemberActivity {


  constructor(public groupUid: string,
              public memberUid: string,
              public actionLogType: string,
              public taskType: string,
              public logSubType: string,
              public nameOfRelatedEntity: string,
              public auxField: string,
              public dateOfLog: Date,
              public dateOfLogEpochMillis: number,
              public topics: string[]) {
  }

  getFormattedDateOfLog():string{
    if (this.dateOfLog != null)
      return new DatePipe("en").transform(this.dateOfLog,"d MMM y, hh:MM a");
    else return "";
  }

  getActionLogIcon(): string{
    if(this.logSubType === "GROUP_MEMBER_ADDED" || this.logSubType === "GROUP_MEMBER_ADDED_AT_CREATION")
      return "assets/add-user.png";
    else if(this.logSubType === "GROUP_MEMBER_REMOVED")
      return "assets/remove-user.png";
    else if(this.logSubType && this.logSubType.startsWith("MEETING"))
      return "assets/icon_meeting.png";
    else if(this.logSubType && this.logSubType.startsWith("VOTE"))
      return "assets/icon_vote.png";
    else if(this.actionLogType === "TODO_LOG")
      return "assets/icon_todo.png";
  }

  getActionDescription(): string{
    if (this.logSubType === "CREATED" || this.logSubType === "CANCELLED") {
      return this.logSubType + "." + this.taskType;
    } else {
      return this.logSubType;
    }
  }
}
