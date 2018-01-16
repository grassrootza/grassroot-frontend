import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/map';
import {GroupInfo} from './model/group-info.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {UserService} from '../user/user.service';
import {Group} from './model/group.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GroupRole} from './model/group-role';
import {DateTimeUtils} from '../utils/DateTimeUtils';
import {TaskType} from '../task/task-type';
import {TaskInfo} from '../task/task-info.model';
import {Membership, MembersPage} from './model/membership.model';
import {GroupMembersImportExcelSheetAnalysis} from './model/group-members-import-excel-sheet-analysis.model';
import {GroupAddMemberInfo} from './model/group-add-member-info.model';
import {GroupModifiedResponse} from './model/group-modified-response.model';
import {GroupRef} from './model/group-ref.model';
import {JoinCodeInfo} from './model/join-code-info';
import {GroupPermissionsByRole} from './model/permission.model';
import {GroupMembersAutocompleteResponse} from './model/group-members-autocomplete-response.model';

@Injectable()
export class GroupService {

  groupListUrl = environment.backendAppUrl + "/api/group/fetch/list";
  groupDetailsUrl = environment.backendAppUrl + "/api/group/fetch/details";
  groupMemberListUrl = environment.backendAppUrl + "/api/group/fetch/members";
  newMembersLIstUrl = environment.backendAppUrl + "/api/group/fetch/members/new";
  groupMembersAddUrl = environment.backendAppUrl + "/api/group/modify/members/add";
  groupCreateUrl = environment.backendAppUrl + "/api/group/modify/create";
  groupPinUrl = environment.backendAppUrl + "/api/group/modify/pin";
  groupUnpinUrl = environment.backendAppUrl + "/api/group/modify/unpin";
  groupRemoveMembersUrl = environment.backendAppUrl + "/api/group/modify/members/remove";
  groupAddMembersToTaskTeamUrl = environment.backendAppUrl + "/api/group/modify/members/add/taskteam";
  groupAssignTopicsToMemebersUrl = environment.backendAppUrl + "/api/group/modify/members/add/topics";
  groupImportMembersAnalyzeUrl = environment.backendAppUrl + "/api/group/import/analyze";
  groupImportMembersConfirmUrl = environment.backendAppUrl + "/api/group/import/confirm";
  groupUpdateSettingsUrl = environment.backendAppUrl + "/api/group/modify/settings";
  groupFetchPermissionsForRoleUrl = environment.backendAppUrl + "/api/group/fetch/permissions";
  groupFetchPermissionsDisplayedUrl = environment.backendAppUrl + "/api/group/fetch/permissions-displayed";
  groupUpdatePermissionsForRole = environment.backendAppUrl + '/api/group/modify/permissions/update';

  groupJoinWordsListUrl = environment.backendAppUrl + "/api/group/modify/joincodes/list/active";
  groupJoinWordAddUrl = environment.backendAppUrl + "/api/group/modify/joincodes/add";
  groupJoinWordRemoveUrl = environment.backendAppUrl + "/api/group/modify/joincodes/remove";

  statsMemberGrowthUrl = environment.backendAppUrl + "/api/group/stats/member-growth";
  statsProvincesUrl = environment.backendAppUrl + "/api/group/stats/provinces";
  statsSourcesUrl = environment.backendAppUrl + "/api/group/stats/sources";
  statsOrganisationsUrl = environment.backendAppUrl + "/api/group/stats/organisations";
  statsMemberDetailsUrl = environment.backendAppUrl + "/api/group/stats/member-details";

  groupSearchUserByTermUrl = environment.backendAppUrl + "/api/group/fetch//user/names";

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
            gr.subGroups,
            gr.topics,
            gr.joinWords,
            gr.joinWordsLeft,
            gr.reminderMinutes
          );
        }
      );
  }


  createGroup(name: string, description: string, permissionTemplate: string, reminderMinutes: number, discoverable: string): Observable<GroupRef> {

    const fullUrl = this.groupCreateUrl;

    let params = new HttpParams()
      .set('name', name)
      .set('description', description)
      .set('permissionTemplate', permissionTemplate)
      .set('reminderMinutes', reminderMinutes.toString())
      .set('discoverable', discoverable);

    return this.httpClient.post<GroupRef>(fullUrl, null, {params: params});
  }


  fetchGroupMembers(groupUid: string, pageNo: number, pageSize: number): Observable<MembersPage> {
    let params = new HttpParams()
      .set('groupUid', groupUid)
      .set('page', pageNo.toString())
      .set('size', pageSize.toString());

    return this.httpClient.get<MembersPage>(this.groupMemberListUrl, {params: params})
      .map(
        result => {
          let transformedContent = result.content.map(m => new Membership(false, m.user, m.group, GroupRole[m.roleName], m.topics, m.joinMethod, m.joinMethodDescriptor));
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

  fetchNewMembers(howRecentlyJoinedInDays: number, pageNo: number, pageSize: number): Observable<MembersPage> {
    console.log("Fetching new members");
    let params = new HttpParams()
      .set('howRecentInDays', howRecentlyJoinedInDays.toString())
      .set('page', pageNo.toString())
      .set('size', pageSize.toString());

    return this.httpClient.get<MembersPage>(this.newMembersLIstUrl, {params: params})
      .map(
        result => {
          console.log("Fetched new members", result);
          let transformedContent = result.content.map(m => new Membership(false, m.user, m.group, GroupRole[m.roleName], m.topics, m.joinMethod, m.joinMethodDescriptor));
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

  removeMembers(groupUid: string, membersUids: string[]):Observable<boolean> {
    const fullUrl = this.groupRemoveMembersUrl + "/" + groupUid;
    const params = {
      'memberUids': membersUids
    };
    return this.httpClient.post<boolean>(fullUrl, null, {params: params})
      .map(response => {
        return response;
      })
  }

  addMembersToTaskTeam(parentGroupUid: string, childGroupUid: string, membersUids: string[]): Observable<boolean> {
    const fullUrl = this.groupAddMembersToTaskTeamUrl + "/" + parentGroupUid;
    const params = {
      'childGroupUid': childGroupUid,
      'memberUids': membersUids
    };

    return this.httpClient.post(fullUrl, null, {params: params})
      .map(response => {
        return true;
      });
  }

  assignTopicToMember(groupUid: string, membersUids: string[], topics: string[]): Observable<boolean> {
    const fullUrl = this.groupAssignTopicsToMemebersUrl + "/" + groupUid;
    const params = {
      'memberUids': membersUids,
      'topics': topics
    };

    return this.httpClient.post(fullUrl, null, {params: params})
      .map(response => {
        console.log(response);
        return true;
      })
  }

  importHeaderAnalyze(file, params):Observable<GroupMembersImportExcelSheetAnalysis>{
    return  this.httpClient.post<GroupMembersImportExcelSheetAnalysis>(this.groupImportMembersAnalyzeUrl, file, {params: params})
      .map(response => {
          return response;
        }
      );
  }

  importAnalyzeMembers(params): Observable<GroupAddMemberInfo[]>{
    return this.httpClient.post<GroupAddMemberInfo[]>(this.groupImportMembersConfirmUrl, null, {params: params})
      .map(
        data => {
          return data.map(
            gami => new GroupAddMemberInfo(gami.memberMsisdn, gami.displayName, gami.roleName, gami.alernateNumbers, gami.emailAddress)
          )
        }
      )
  }

  confirmAddMembersToGroup(groupUid: string, membersInfoToAdd: GroupAddMemberInfo[]):Observable<GroupModifiedResponse>{
    const fullUrl = this.groupMembersAddUrl + "/" + groupUid;
    return this.httpClient.post<GroupModifiedResponse>(fullUrl, membersInfoToAdd)
      .map(resp => {
        return resp;
      })

  }

  fetchActiveJoinWords(): Observable<string[]> {
    const fullUrl = this.groupJoinWordsListUrl;
    return this.httpClient.get<string[]>(fullUrl);
  }

  addGroupJoinWord(groupUid: string, joinWord: string): Observable<JoinCodeInfo> {
    const fullUrl = this.groupJoinWordAddUrl + "/" + groupUid;
    // nb : must always mirror inbound routing
    const inboundUrl = environment.frontendAppUrl + "/" + groupUid + "/" + joinWord;
    return this.httpClient.post<JoinCodeInfo>(fullUrl, null, { params: {
      "joinWord": joinWord, "longJoinUrl": inboundUrl
    }});
  }

  removeGroupJoinWord(groupUid: string, joinWord: string) {
    const fullUrl = this.groupJoinWordRemoveUrl + "/" + groupUid;
    return this.httpClient.post(fullUrl, null, { params: {
      "joinWord": joinWord
      }});
  }

  fetchMemberGrowthStats(groupUid: string, year: number, month: number): Observable<any> {

    const fullUrl = this.statsMemberGrowthUrl;
    let params = new HttpParams()
      .set("groupUid", groupUid);

    if (year)
      params = params.set("year", year.toString());

    if (month)
      params = params.set("month", month.toString());

    return this.httpClient.get<any>(fullUrl, {params: params});

  }

  fetchProvinceStats(groupUid: string): Observable<any> {

    const fullUrl = this.statsProvincesUrl;
    let params = new HttpParams()
      .set("groupUid", groupUid);
    return this.httpClient.get<any>(fullUrl, {params: params});
  }

  fetchSourcesStats(groupUid: string): Observable<any> {

    const fullUrl = this.statsSourcesUrl;
    let params = new HttpParams()
      .set("groupUid", groupUid);
    return this.httpClient.get<any>(fullUrl, {params: params});
  }

  fetchOrganisationsStats(groupUid: string): Observable<any> {

    const fullUrl = this.statsOrganisationsUrl;
    let params = new HttpParams()
      .set("groupUid", groupUid);
    return this.httpClient.get<any>(fullUrl, {params: params});
  }

  fetchMemberDetailsStats(groupUid: string): Observable<any> {

    const fullUrl = this.statsMemberDetailsUrl;
    let params = new HttpParams()
      .set("groupUid", groupUid);
    return this.httpClient.get<any>(fullUrl, {params: params});
  }





  updateGroupSettings(groupUid: string, name: string, description: string, isPublic: boolean, reminderInMinutes: number): Observable<boolean> {
    const fullUrl = this.groupUpdateSettingsUrl + '/' + groupUid;

    let params = new HttpParams()
      .set('name', name)
      .set('description', description)
      .set('isPublic', isPublic.toString())
      .set('reminderMinutes', reminderInMinutes.toString());

    return this.httpClient.post<boolean>(fullUrl, null, {params: params}).map(resp => {
      return resp;
    })
  }

  updateGroupPermissionsForRole(updatedPermissionsByRole: any, groupUid: string): Observable<any> {
    const fullUrl = this.groupUpdatePermissionsForRole + '/' + groupUid;

    return this.httpClient.post<any>(fullUrl, updatedPermissionsByRole).map(resp => {
      return resp;
    })
  }

  fetchGroupPermissionsToDisplay(): Observable<string[]> {

    return this.httpClient.get<string[]>(this.groupFetchPermissionsDisplayedUrl).map(resp => {
      return resp;
    })
  }

  fetchGroupPermissionsForRole(groupUid: string, roleName: string[]): Observable<GroupPermissionsByRole> {
    const fullUrl = this.groupFetchPermissionsForRoleUrl + '/' + groupUid;

    let params = new HttpParams()
      .set('roleNames', roleName.join(","));

    return this.httpClient.post<GroupPermissionsByRole>(fullUrl, null, {params: params}).map(resp => {
      return new GroupPermissionsByRole(resp);
    })
  }

  searchForUsers(searchTerm: string): Observable<GroupMembersAutocompleteResponse[]> {
    let params = new HttpParams()
      .set('fragment', searchTerm);

    return this.httpClient.get<GroupMembersAutocompleteResponse[]>(this.groupSearchUserByTermUrl, {params: params})
      .map(resp => {
        return resp;
      })
  }

}
