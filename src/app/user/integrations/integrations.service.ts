import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {IntegrationSettingsList} from "../model/integration-settings";
import {Observable} from "rxjs/Observable";

@Injectable()
export class IntegrationsService {

  settingsUrlBase = environment.backendAppUrl + "/api/integration/settings";

  constructor(private httpClient: HttpClient) { }

  // we may want to cache this at some point, but it's important to keep it current, so ...
  fetchCurrentConnections(): Observable<IntegrationSettingsList> {
    return this.httpClient.get(this.settingsUrlBase + "/status/all")
      .map(result => result["currentIntegrations"]);
  }

  initiateFbConnect() {
    return this.httpClient.get(this.settingsUrlBase + "/connect/facebook/initiate", { responseType: 'text' });
  }

  storeFbConnectResult(returnedParams: any) {
    console.log("params: ", returnedParams);
    return this.httpClient.get(this.settingsUrlBase + "/connect/facebook/complete", { params: returnedParams });
  }

}
