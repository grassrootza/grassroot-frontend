import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AuthHttp} from "angular2-jwt";
import {environment} from "../../environments/environment.prod";
import "rxjs/add/operator/map";
import {Group} from "./group.model";
import {UserService} from "../user/user.service";

@Injectable()
export class GroupService {

  groupListUrl = environment.backendAppUrl + "/api/group/list/";

  constructor(private authHttp: AuthHttp, private userService: UserService) {
  }


  loadGroups(): Observable<Group[]> {

    const phoneNumber = this.userService.getLoggedInUser().phoneNumber;

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
