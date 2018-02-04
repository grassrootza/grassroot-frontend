export class GroupModifiedResponse {

  constructor(public groupName: string,
              public membersAdded: number,
              public invalidNumbers: String[]) {
  }
}
