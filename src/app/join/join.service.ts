import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {JoinRequest} from "./join-info";

@Injectable()
export class JoinService {

  baseUrl = environment.backendAppUrl + "/api/group/outside/join/";

  constructor(private httpClient: HttpClient) { }

  initiateJoinSequence(groupUid: string, code: string) {
    const fullUrl = this.baseUrl + "start/" + groupUid;
    return this.httpClient.get(fullUrl, { params: { "code": code } });
  }

  completeJoinSequence(groupUid: string, code: string, joinRequest: JoinRequest) {
    const fullUrl = this.baseUrl + "complete/" + groupUid;
    return this.httpClient.post<string>(fullUrl, joinRequest, { params: { "code" : code }});
  }

}
