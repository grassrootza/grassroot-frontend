export class IntegrationSettingsList {

  facebook: IntegrationSettings = new IntegrationSettings();
  twitter: IntegrationSettings = new IntegrationSettings();
  google: IntegrationSettings = new IntegrationSettings();

}

export class IntegrationSettings {

  userConnectionValid: boolean = false;
  managedPages: ManagedPage[] = [];

}

export class ManagedPage {

  providerUserId: string = "";
  displayName: string = "";
  imageUrl: string = "";

}