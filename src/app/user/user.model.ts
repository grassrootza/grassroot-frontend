export class User {
  constructor(public uid: String,
              public displayName: string,
              public phoneNumber: string,
              public token: string) {
  }
}


export class AuthorizationResponse {

  constructor(public user: User, public errorCode: string) {
  }
}
