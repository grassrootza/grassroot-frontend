import {PhoneNumberUtils} from "../utils/PhoneNumberUtils";
import {UserProvince} from "./model/user-province.enum";

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
              public msisdn: string,
              public email: string,
              public languageCode: string,
              public province: string,
              public token: string) {
  }

}

export class UserProfile {
  name: string = "";
  phone: string = "";
  email: string = "";
  // note: typescript enum handling is garbage, so this line results in the label string
  // province: UserProvince = UserProvince.ZA_GP;
  province: string = 'ZA_GP';
  language: string = "en";

  constructor(user?: AuthenticatedUser) {
    if (user) {
      this.name = (user.displayName) ? user.displayName : "";
      this.phone = (user.msisdn) ? PhoneNumberUtils.convertFromSystem(user.msisdn) : "";
      this.email = (user.email) ? user.email : "";
      this.province = (user.province) ? user.province : 'ZA_GP';
      this.language = (user.languageCode) ? user.languageCode : "en";
    }
  }
}
