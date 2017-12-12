import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AuthHttp} from "angular2-jwt";
import {environment} from "../../environments/environment.prod";
import "rxjs/add/operator/map";
import {GroupInfo} from "./model/group-info.model";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {UserService} from "../user/user.service";
import {Headers, RequestOptions, URLSearchParams} from "@angular/http";
import {Group} from "./model/group.model";

@Injectable()
export class GroupService {

  groupListUrl = environment.backendAppUrl + "/api/group/fetch/list";
  groupDetailsUrl = environment.backendAppUrl + "/api/group/fetch/details";
  groupCreateUrl = environment.backendAppUrl + "/api/group/modify/create";
  groupPinUrl = environment.backendAppUrl + "/api/group/modify/pin";
  groupUnpinUrl = environment.backendAppUrl + "/api/group/modify/unpin";

  private groupInfoList_: BehaviorSubject<GroupInfo[]> = new BehaviorSubject([]);
  public groupInfoList: Observable<GroupInfo[]> = this.groupInfoList_.asObservable();

  constructor(private authHttp: AuthHttp, private userService: UserService) {
  }

  loadGroups(clearCache: boolean) {

    if (this.groupInfoList_.getValue().length == 0 || clearCache) {
      const fullUrl = this.groupListUrl;

      return this.authHttp.get(fullUrl)
        .map(resp => resp.json())
        .map(json => {
            console.log("groups json: ", json);
            return json.map(grJson => GroupInfo.fromJson(grJson));
          }
        ).subscribe(
          groups => {
            this.groupInfoList_.next(groups);
          },
          error => {
            if (error.status = 401)
              this.userService.logout();
            console.log("Error loading groups", error.status)
          });
    }
  }

  loadGroupDetails(groupUid: string): Observable<Group> {

    const fullUrl = this.groupDetailsUrl + "/" + groupUid;
    return this.authHttp.get(fullUrl)
      .map(resp => resp.json())
      .map(grJson => {
        console.log("Groupo details json: ", grJson);
        return Group.fromJson(grJson);
      });

  }

  createGroup(name: string, description: string, permissionTemplate: string, reminderMinutes: number, discoverable: string): Observable<string> {

    const fullUrl = this.groupCreateUrl;

    const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    const options = new RequestOptions({headers: headers});
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('description', description);
    params.append('permissionTemplate', permissionTemplate);
    params.append('reminderMinutes', reminderMinutes.toString());
    params.append('discoverable', discoverable);

    return this.authHttp.post(fullUrl, params, options)
      .map(resp => resp.text())
      .map(groupId => {
          console.log("group created, uid: ", groupId);
          return groupId;
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
