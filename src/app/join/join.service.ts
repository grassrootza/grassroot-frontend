import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {JoinRequest} from "./join-info";

@Injectable()
export class JoinService {

  baseUrl = environment.backendAppUrl + "/api/group/outside/join/";

  constructor(private httpClient: HttpClient) { }

  initiateJoinSequence(groupUid: string, code: string, broadcastId: string) {
    const fullUrl = this.baseUrl + "start/" + groupUid;
    let params = new HttpParams();
    if (!!code)
      params = params.set("code", code);
    if (!!broadcastId)
      params = params.set("broadcastId", broadcastId);
    return this.httpClient.get(fullUrl, { params: params });
  }

  completeJoinSequence(groupUid: string, code: string, broadcastId: string, joinRequest: JoinRequest) {
    const fullUrl = this.baseUrl + "complete/" + groupUid;
    let params = new HttpParams();
    if (!!code)
      params = params.set("code", code);
    if (!!broadcastId)
      params = params.set("broadcastId", broadcastId);
    console.log("http params = ", params);
    return this.httpClient.post<string>(fullUrl, joinRequest, { params: params });
  }

}
