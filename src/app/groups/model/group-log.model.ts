import {User, UserProfile} from "../../user/user.model";
import {DatePipe} from "@angular/common";
import {DateTimeUtils} from "../../utils/DateTimeUtils";

export class GroupLog {


  constructor(public id: number,
              public createdDateTime: Date,
              public targetUser: User,
              public description: string) {
  }

  public getFormattedEventTime(): string {
    if (this.createdDateTime != null)
      return new DatePipe("en").transform(this.createdDateTime,"d MMM y, hh:MM a");
    else return "";
  }


  public static createInstance(groupLogData: GroupLog): GroupLog {
    return new GroupLog(groupLogData.id,  DateTimeUtils.parseDate(groupLogData.createdDateTime), groupLogData.targetUser, groupLogData.description);
  }

}

export class GroupLogPage {
  constructor(public number: number,
              public totalPages: number,
              public totalElements: number,
              public size: number,
              public first: boolean,
              public last: boolean,
              public content: GroupLog[]) {
  }
}
