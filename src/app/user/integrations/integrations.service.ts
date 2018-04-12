import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {IntegrationSettingsList} from "../model/integration-settings";
import {Observable} from "rxjs/Observable";

@Injectable()
export class IntegrationsService {

  settingsUrlBase = environment.backendAppUrl + "/api/integration/settings";

  constructor(private httpClient: HttpClient) { }

  // we may want to cache this at some point, but it's important to keep it current, so ...
  fetchCurrentConnections(): Observable<IntegrationSettingsList> {
    return this.httpClient.get<IntegrationSettingsList>(this.settingsUrlBase + "/status/all")
      .map(result => result["currentIntegrations"]);
  }

  initiateFbConnect() {
    return this.httpClient.get(this.settingsUrlBase + "/connect/facebook/initiate", { responseType: 'text' });
  }

  initiateTwitterConnect() {
    return this.httpClient.get(this.settingsUrlBase + "/connect/twitter/initiate", { responseType: 'text' });
  }

  storeProviderConnectResult(provider: string, returnedParams: any) {
    console.log("params: ", returnedParams);
    if (provider === 'facebook') {
        let params = new HttpParams().set("code", returnedParams.code);
        return this.httpClient.get(this.settingsUrlBase + "/connect/facebook/complete", { params: returnedParams });
    } else {
        return this.httpClient.get(this.settingsUrlBase + "/connect/" + provider + "/complete", { params: returnedParams });
    }
  }

  removeProviderPage(provider: string, providerUserId: string) {
    const params = new HttpParams().set("providerUserId", providerUserId);
    return this.httpClient.post<IntegrationSettingsList>(this.settingsUrlBase + "/remove/" + provider, null, {params: params});
  }

}
