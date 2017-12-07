export class GroupRef {

  constructor(public uid: string,
              public name: string,
              public memberCount: number) {
  }

  public static fromJson(json): GroupRef {
    return new GroupRef(json.groupUid, json.name, json.memberCount)
  }

}
