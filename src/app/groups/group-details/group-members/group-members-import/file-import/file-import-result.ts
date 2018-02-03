import {GroupAddMemberInfo} from "../../../../model/group-add-member-info.model";

export class FileImportResult {

  constructor(public processedMembers: GroupAddMemberInfo[] = [],
              public errorRows: string[] = [],
              public errorFilePath: string = "") {

  }
}
