import {PhoneNumberUtils} from "../utils/PhoneNumberUtils";

export class User {
  constructor(public uid: string,
              public displayName: string,
              public phoneNumber: string,
              public email: string,
              public lastName: string,
              public firstName: string,
              public enabled: string,
              public languageCode: string,
              public province: string,
              public hasPassword: boolean,
              public contactError: boolean,
              public whatsAppOptedIn: boolean) {//Included whatsAppOptedIn field
  }
}

export class AuthorizationResponse {
  constructor(public user: AuthenticatedUser, public errorCode: string) {
  }
}

export class AuthenticatedUser {
  constructor(public userUid: string,
              public displayName: string,
              public msisdn: string,
              public email: string,
              public languageCode: string,
              public province: string,
              public hasImage: boolean,
              public token: string,
              public systemRoles: string[],
              public hasAccount: boolean,
              public whatsAppOptedIn: boolean) {//Included whatsAppOptedIn field
  }

  hasAccountAdmin() {
    return this.systemRoles && this.systemRoles.indexOf('ROLE_ACCOUNT_ADMIN') != -1;
  }

  hasLiveWireAdmin() {
    return this.systemRoles && this.systemRoles.indexOf('ROLE_LIVEWIRE_USER') != -1;
  }

  hasSystemAdmin() {
    return this.systemRoles && this.systemRoles.indexOf('ROLE_SYSTEM_ADMIN') != -1;
  }

  hasLiveWireRole() {
    return this.systemRoles && this.systemRoles.indexOf('ROLE_LIVEWIRE_USER') != -1;
  }
}

export const getAuthUser = (au: AuthenticatedUser): AuthenticatedUser => {
  return new AuthenticatedUser(
    au.userUid,
    au.displayName,
    au.msisdn,
    au.email,
    au.languageCode,
    au.province,
    au.hasImage,
    au.token,
    au.systemRoles,
    au.hasAccount,
    au.whatsAppOptedIn
  );
};

export class UserProfile {
  name: string = "";
  phone: string = "";
  email: string = "";
  province: string = 'ZA_GP';
  language: string = "en";
  whatsAppOptedIn: boolean = false;//added whats app opt in parameter


  constructor(user?: AuthenticatedUser) {
    if (user) {
      this.name = (user.displayName) ? user.displayName : "";
      this.phone = (user.msisdn) ? PhoneNumberUtils.convertFromSystem(user.msisdn) : "";
      this.email = (user.email) ? user.email : "";
      this.province = (user.province) ? user.province : 'ZA_GP';
      this.language = (user.languageCode) ? user.languageCode : "en";
      this.whatsAppOptedIn = (user.whatsAppOptedIn); //Included whatsAppOptedIn constructor field
    }
  }
}
