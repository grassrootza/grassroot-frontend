import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable()
export class JoinService {

  baseUrl = environment.backendAppUrl + "/api/group/outside/join/";


  constructor(private httpClient: HttpClient) { }

  initiateJoinSequence(groupUid: string, code: string) {
    const fullUrl = this.baseUrl + "start/" + groupUid;
    return this.httpClient.get(fullUrl, { params: { "code": code } });
  }

}
