import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment.prod";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class IntegrationsService {

  settingsUrlBase = environment.backendAppUrl + "/api/integration/settings";

  constructor(private httpClient: HttpClient) { }

  initiateFbConnect() {
    return this.httpClient.get(this.settingsUrlBase + "/connect/facebook/initiate", { responseType: 'text' });
  }

  storeFbConnectResult(returnedParams: any) {
    this.httpClient.get(this.settingsUrlBase + "/connect/facebook/complete", { params: returnedParams })
      .subscribe(response => {
        console.log("received response: ", response);
      }, error => {
        console.log("but error: ", error);
      })
  }

}
