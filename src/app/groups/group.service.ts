import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Response} from "@angular/http";
import {AuthHttp} from "angular2-jwt";
import {environment} from "../../environments/environment.prod";

@Injectable()
export class GroupService {

  groupListUrl = environment.backendAppUrl + "/api/group/list/";

  constructor(private authHttp:AuthHttp) { }

  loadGroups() : Observable<Response> {

    const phoneNumber = localStorage.getItem("msisdn");

    const fullUrl = this.groupListUrl + phoneNumber + "/hgh";
    return this.authHttp.get(fullUrl);

  }

}
