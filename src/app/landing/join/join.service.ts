import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "environments/environment";
import {JoinRequest, JoinResult} from "./join-info";
import {Observable} from "rxjs/Observable";

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

  completeJoinSequence(groupUid: string, code: string, broadcastId: string, joinRequest: JoinRequest): Observable<JoinResult> {
    const fullUrl = this.baseUrl + "complete/" + groupUid;
    let params = new HttpParams();
    if (!!code)
      params = params.set("code", code);
    if (!!broadcastId)
      params = params.set("broadcastId", broadcastId);
    console.log("http params = ", params);
    return this.httpClient.post<JoinResult>(fullUrl, joinRequest, { params: params });
  }

  completeJoinForLoggedIn(groupUid: string, code: string, broadcastId: string, topics: string[]): Observable<JoinResult> {
    const fullUrl = this.baseUrl + "complete/" + groupUid;
    let params = new HttpParams()
      .set("joinTopics", topics.join(","));
    if (!!code)
      params = params.set("code", code);
    if (!!broadcastId)
      params = params.set("broadcastId", broadcastId);
    return this.httpClient.post<JoinResult>(fullUrl, null,  { params: params });
  }

  setTopics(groupUid: string, userUid: string, validationCode: string, topics: string[]) {
    const fullUrl = this.baseUrl + "topics/" + groupUid;
    let params = new HttpParams().set("joinedUserUid", userUid).set("validationCode", validationCode)
      .set("joinTopics", topics.join(","));
    return this.httpClient.post(fullUrl, null, { params: params });
  }

}
