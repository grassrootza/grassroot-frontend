import {User} from "../../user/user.model";
import {GroupRole} from "./group-role";
import {DatePipe} from "@angular/common";

export class Group {

  public formattedCreationTime: string = "";

  constructor(public uid: string,
              public name: string,
              public description: string,
              public creatorUid: string,
              public creatorName: string,
              public creationTime: Date,
              public discoverable: boolean,
              public memberCount: number,
              public hasTasks: boolean,
              public joinCode: string,
              public lastChangeDescription: string,
              public lastChangeType: string,
              public lastMajorChangeMillis: number,
              public members: User[],
              public paidFor: boolean,
              public userPermissions: string[],
              public userRole: string) {
    this.formattedCreationTime = new DatePipe("en").transform(this.creationTime, "dd MMM, y");
  }

  public hasPermission(permission: string) {
    return this.userPermissions.indexOf(permission) >= 0;
  }



  public getFormattedRoleName(): string {
    return GroupRole[this.userRole];
  }

}
