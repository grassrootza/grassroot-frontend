export class User {
  constructor(public uid: String,
              public displayName: string,
              public phoneNumber: string,
              public email: string,
              public lastName: string,
              public firstName: string,
              public enabled: string,
              public languageCode: string,) {
  }
}


export class AuthorizationResponse {

  constructor(public user: AuthenticatedUser, public errorCode: string) {
  }
}

export class AuthenticatedUser {
  constructor(public uid: String,
              public displayName: string,
              public phoneNumber: string,
              public token: string) {
  }
}
