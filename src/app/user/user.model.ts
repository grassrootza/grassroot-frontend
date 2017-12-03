export class User {

  constructor(public uid: String,
              public displayName: string,
              public phoneNumber: string,) {
  }


  public static fromJson(json) {
    return new User(json.uid, json.displayName, json.phoneNumber)
  }
}
