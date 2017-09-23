import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AuthHttp} from "angular2-jwt";
import {environment} from "../../environments/environment.prod";
import "rxjs/add/operator/map";
import {Group} from "./group.model";

@Injectable()
export class GroupService {

  groupListUrl = environment.backendAppUrl + "/api/group/list/";

  constructor(private authHttp:AuthHttp) { }


  loadGroups(): Observable<Group[]> {

    const phoneNumber = localStorage.getItem("msisdn");

    const fullUrl = this.groupListUrl + phoneNumber + "/hgh";

    return this.authHttp.get(fullUrl)
      .map(resp => resp.json())
      .map(json => {
          console.log("groups json: ", json.addedAndUpdated);
          return json.addedAndUpdated.map(grJson => Group.fromJson(grJson));
        }
      );

  }

}
