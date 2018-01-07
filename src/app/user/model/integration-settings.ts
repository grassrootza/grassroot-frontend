export class IntegrationSettingsList {

  facebook: IntegrationSettings = new IntegrationSettings();
  twitter: IntegrationSettings = new IntegrationSettings();
  google: IntegrationSettings = new IntegrationSettings();

}

export class IntegrationSettings {

  userConnectionValid: boolean = false;
  managedPages: Map<string, string> = new Map();

}

// export class ManagedPageOrAccount {
//
//   providerUserId: string = ;
//
// }
