import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment.prod";
import "rxjs/add/operator/map";
import {GroupInfo} from "./model/group-info.model";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {UserService} from "../user/user.service";
import {Group} from "./model/group.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {GroupRole} from "./model/group-role";
import {DateTimeUtils} from "../DateTimeUtils";
import {TaskType} from "../task/task-type";
import {TaskInfo} from "../task/task-info.model";
import {Membership, MembersPage} from "./model/membership.model";

@Injectable()
export class GroupService {

  groupListUrl = environment.backendAppUrl + "/api/group/fetch/list";
  groupDetailsUrl = environment.backendAppUrl + "/api/group/fetch/details";
  groupMemberListUrl = environment.backendAppUrl + "/api/group/fetch/members";
  groupCreateUrl = environment.backendAppUrl + "/api/group/modify/create";
  groupPinUrl = environment.backendAppUrl + "/api/group/modify/pin";
  groupUnpinUrl = environment.backendAppUrl + "/api/group/modify/unpin";

  private groupInfoList_: BehaviorSubject<GroupInfo[]> = new BehaviorSubject([]);
  public groupInfoList: Observable<GroupInfo[]> = this.groupInfoList_.asObservable();

  constructor(private httpClient: HttpClient, private userService: UserService) {
  }

  loadGroups(clearCache: boolean) {

    if (this.groupInfoList_.getValue().length == 0 || clearCache) {
      const fullUrl = this.groupListUrl;

      return this.httpClient.get<GroupInfo[]>(fullUrl)
        .map(
          data => {
            console.log("Groups json object from server: ", data);
            return data.map(
              gr => new GroupInfo(
                gr.name,
                gr.description,
                gr.memberCount,
                gr.groupUid,
                gr.userPermissions,
                GroupRole[gr.userRole],
                gr.nextEventTime != null ? DateTimeUtils.getDateFromJavaInstant(gr.nextEventTime) : null,
                gr.nextEventType != null ? TaskType[gr.nextEventType] : null,
                gr.pinned,
                gr.comingUpEvents.map(e => new TaskInfo(e.taskUid, e.title, TaskType[e.taskType], DateTimeUtils.getDateFromJavaInstant(e.deadlineTime))),
                gr.subGroups
              )
            )
          }
        )
        .subscribe(
          groups => {
            this.groupInfoList_.next(groups);
          },
          error => {
            if (error.status == 401)
              this.userService.logout();
            console.log("Error loading groups", error)
          });
    }
  }

  loadGroupDetails(groupUid: string): Observable<Group> {
    const fullUrl = this.groupDetailsUrl + "/" + groupUid;

    return this.httpClient.get<Group>(fullUrl)
      .map(
        gr => {
          console.log("Group details loaded : ", gr);
          return new Group(
            gr.groupUid,
            gr.name,
            gr.description,
            gr.groupCreatorUid,
            gr.groupCreatorName,
            gr.groupCreationTimeMillis,
            new Date(gr.groupCreationTimeMillis),
            gr.discoverable,
            gr.memberCount,
            gr.joinCode,
            gr.lastChangeDescription,
            gr.lastChangeType,
            gr.lastMajorChangeMillis,
            gr.members,
            gr.paidFor,
            gr.userPermissions,
            gr.userRole,
            gr.subGroups
          );
        }
      );
  }


  createGroup(name: string, description: string, permissionTemplate: string, reminderMinutes: number, discoverable: string): Observable<string> {

    const fullUrl = this.groupCreateUrl;
    const params = {
      'name': name,
      'description': description,
      'permissionTemplate': permissionTemplate,
      'reminderMinutes': reminderMinutes.toString(),
      'discoverable': discoverable
    };
    return this.httpClient.post<string>(fullUrl, params);
  }


  fetchGroupMembers(groupUid: string, pageNo: number, pageSize: number): Observable<MembersPage> {
    let params = new HttpParams()
      .set('groupUid', groupUid)
      .set('page', pageNo.toString())
      .set('size', pageSize.toString());

    return this.httpClient.get<MembersPage>(this.groupMemberListUrl, {params: params})
      .map(
        result => {
          let transformedContent = result.content.map(m => new Membership(false, m.user, m.group, GroupRole[m.roleName]));
          return new MembersPage(
            result.number,
            result.totalPages,
            result.totalElements,
            result.size,
            result.first,
            result.last,
            transformedContent
          )
        }
      );
  }

  pinGroup(groupUid: string): Observable<boolean> {
    const fullUrl = this.groupPinUrl + "/" + groupUid;
    return this.httpClient.get<boolean>(fullUrl);
  }

  unpinGroup(groupUid: string): Observable<boolean> {

    const fullUrl = this.groupUnpinUrl + "/" + groupUid;
    return this.httpClient.get<boolean>(fullUrl);
  }


}
