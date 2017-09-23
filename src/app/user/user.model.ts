export class User {

  constructor(public displayName: string,
              public phoneNumber: string,) {
  }


  public static fromJson(json) {
    return new User(json.displayName, json.phoneNumber)
  }
}
