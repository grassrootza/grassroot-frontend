import {TaskInfo} from "../../task/task-info.model";
import {GroupRef} from "./group-ref.model";
import {GroupRole} from "./group-role";
import {TaskType} from "../../task/task-type";
import {DatePipe} from "@angular/common";
import {DateTimeUtils} from "../../utils/DateTimeUtils";
import { environment } from "environments/environment";

const imgBaseUrl = environment.backendAppUrl + "/api/image/group";

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
              public hidden: boolean,
              public profileImageUrl: string,
              public comingUpEvents: TaskInfo[],
              public subGroups: GroupRef[],
              public topics: string[]) {
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

  public getImageUrl() {
    return this.profileImageUrl ? imgBaseUrl + "/" + this.groupUid : '';
  }

  public static createInstance(groupInfoData: GroupInfo): GroupInfo {
    return new GroupInfo(
      groupInfoData.name,
      groupInfoData.description,
      groupInfoData.memberCount,
      groupInfoData.groupUid,
      groupInfoData.userPermissions,
      GroupRole[<string>groupInfoData.userRole],
      DateTimeUtils.parseDate(groupInfoData.nextEventTime),
      groupInfoData.nextEventType != null ? TaskType[<string>groupInfoData.nextEventType] : null,
      groupInfoData.pinned,
      groupInfoData.hidden,
      groupInfoData.profileImageUrl,
      groupInfoData.comingUpEvents.map(e => TaskInfo.createInstance(e)),
      groupInfoData.subGroups,
      groupInfoData.topics
    )
  }




}
