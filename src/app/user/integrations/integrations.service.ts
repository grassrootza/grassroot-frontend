import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FacebookPage, IntegrationSettingsList, TwitterAccount} from "../model/integration-settings";
import {Observable} from "rxjs/Observable";

@Injectable()
export class IntegrationsService {

  settingsUrlBase = environment.backendAppUrl + "/api/integration/settings";

  constructor(private httpClient: HttpClient) { }

  fetchFbAccounts(): Observable<FacebookPage[]> {
    return this.httpClient.get<FacebookPage[]>(this.settingsUrlBase + "/status/facebook");
  }

  fetchTwitterAccount(): Observable<TwitterAccount> {
    return this.httpClient.get<TwitterAccount>(this.settingsUrlBase + "/status/twitter");
  }

  initiateFbConnect() {
    return this.httpClient.get(this.settingsUrlBase + "/connect/facebook/initiate", { responseType: 'text' });
  }

  initiateTwitterConnect() {
    return this.httpClient.get(this.settingsUrlBase + "/connect/twitter/initiate", { responseType: 'text' });
  }

  storeProviderConnectResult(provider: string, returnedParams: any) {
    console.log("params: ", returnedParams);
    return this.httpClient.get(this.settingsUrlBase + "/connect/" + provider + "/complete", { params: returnedParams });
  }

  removeProviderPage(provider: string, providerUserId: string) {
    const params = new HttpParams().set("providerUserId", providerUserId);
    return this.httpClient.post<IntegrationSettingsList>(this.settingsUrlBase + "/remove/" + provider, null, {params: params});
  }

}
