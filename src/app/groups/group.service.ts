import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AuthHttp} from "angular2-jwt";
import {environment} from "../../environments/environment.prod";
import "rxjs/add/operator/map";
import {GroupInfo} from "./group-info.model";

@Injectable()
export class GroupService {

  groupListUrl = environment.backendAppUrl + "/api/group/fetch/list";
  groupPinUrl = environment.backendAppUrl + "/api/group/modify/pin";
  groupUnpinUrl = environment.backendAppUrl + "/api/group/modify/unpin";

  constructor(private authHttp: AuthHttp) {
  }

  loadGroups(): Observable<GroupInfo[]> {

    const fullUrl = this.groupListUrl;

    return this.authHttp.get(fullUrl)
      .map(resp => resp.json())
      .map(json => {
          console.log("groups json: ", json);
          return json.map(grJson => GroupInfo.fromJson(grJson));
        }
      );
  }


  pinGroup(groupUid: string): Observable<boolean> {

    const fullUrl = this.groupPinUrl + "/" + groupUid;
    return this.authHttp.get(fullUrl)
      .map(resp => resp.json())
      .map(json => {
          console.log("group pin resp: ", json);
          return json.data == "true";
        }
      );
  }

  unpinGroup(groupUid: string): Observable<boolean> {

    const fullUrl = this.groupUnpinUrl + "/" + groupUid;
    return this.authHttp.get(fullUrl)
      .map(resp => resp.json())
      .map(json => {
          console.log("group unpin resp: ", json);
          return json.data == "true";
        }
      );
  }

}
