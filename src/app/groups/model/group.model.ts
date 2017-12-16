import {User} from "../../user/user.model";
import {GroupRole} from "./group-role";
import {DatePipe} from "@angular/common";

export class Group {

  public formattedCreationTime: string = "";

  constructor(public groupUid: string,
              public name: string,
              public description: string,
              public groupCreatorUid: string,
              public groupCreatorName: string,
              public groupCreationTimeMillis: number,
              public groupCreationTime: Date,
              public discoverable: boolean,
              public memberCount: number,
              public joinCode: string,
              public lastChangeDescription: string,
              public lastChangeType: string,
              public lastMajorChangeMillis: number,
              public members: User[],
              public paidFor: boolean,
              public userPermissions: string[],
              public userRole: string) {
    this.formattedCreationTime = new DatePipe("en").transform(this.groupCreationTime, "dd MMM, y");
  }

  public hasPermission(permission: string) {
    return this.userPermissions.indexOf(permission) >= 0;
  }



  public getFormattedRoleName(): string {
    return GroupRole[this.userRole];
  }

}
