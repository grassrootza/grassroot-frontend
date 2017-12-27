import {GroupRole} from "./group-role";
import {DatePipe} from "@angular/common";
import {MembershipInfo} from "./membership.model";
import {GroupRef} from "./group-ref.model";

export class GroupMembersImportExcelSheetAnalysis {


  constructor(public tmpFilePath: String,
              public firstRowCells: String[]) {
  }
}
