import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {environment} from '../../environments/environment';
import 'rxjs/add/operator/map';
import {GroupInfo} from './model/group-info.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {UserService} from '../user/user.service';
import {Group} from './model/group.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DateTimeUtils} from '../utils/DateTimeUtils';
import {Membership, MembersPage} from './model/membership.model';
import {GroupMembersImportExcelSheetAnalysis} from './model/group-members-import-excel-sheet-analysis.model';
import {getAddMemberInfo, GroupAddMemberInfo} from './model/group-add-member-info.model';
import {GroupModifiedResponse} from './model/group-modified-response.model';
import {getGroupMembersList, GroupRef} from './model/group-ref.model';
import {JoinCodeInfo} from './model/join-code-info';
import {GroupPermissionsByRole} from './model/permission.model';
import {GroupRelatedUserResponse} from './model/group-related-user.model';
import {GroupMemberActivity} from './model/group-member-activity';
import {MembersFilter} from "./member-filter/filter.model";
import {PhoneNumberUtils} from "../utils/PhoneNumberUtils";
import {FileImportResult} from "./group-details/group-members/group-members-import/file-import/file-import-result";

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
  groupAssignTopicsToMembersUrl = environment.backendAppUrl + "/api/group/modify/members/add/topics";
  groupImportMembersAnalyzeUrl = environment.backendAppUrl + "/api/group/import/analyze";
  groupImportMembersConfirmUrl = environment.backendAppUrl + "/api/group/import/confirm";
  groupImportErrorsDownloadUrl = environment.backendAppUrl + "/api/group/import/errors/xls";

  groupUpdateSettingsUrl = environment.backendAppUrl + "/api/group/modify/settings";
  groupFetchPermissionsForRoleUrl = environment.backendAppUrl + "/api/group/fetch/permissions";
  groupFetchPermissionsDisplayedUrl = environment.backendAppUrl + "/api/group/fetch/permissions-displayed";
  groupUpdatePermissionsForRole = environment.backendAppUrl + '/api/group/modify/permissions/update';
  groupFetchMemberByMemberUidUrl = environment.backendAppUrl + '/api/group/fetch/member';
  groupFetchMemberActivityUrl = environment.backendAppUrl + '/api/group/fetch/members/activity';
  groupMemberChangeRoleUrl = environment.backendAppUrl + '/api/group/modify/members/modify/role';
  groupMemberChangeDetailsUrl = environment.backendAppUrl + '/api/group/modify/members/modify/details';
  groupMemberChangeAssignmentsUrl = environment.backendAppUrl + '/api/group/modify/members/modify/assignments';

  groupFilterMembersUrl = environment.backendAppUrl + '/api/group/fetch/members/filter';
  groupCreateTaskTeamUrl = environment.backendAppUrl + '/api/group/modify/create/taskteam';
  groupUploadImageUrl = environment.backendAppUrl + "/api/group/modify/image/upload";

  groupJoinWordsListUrl = environment.backendAppUrl + "/api/group/modify/joincodes/list/active";
  groupJoinWordAddUrl = environment.backendAppUrl + "/api/group/modify/joincodes/add";
  groupJoinWordRemoveUrl = environment.backendAppUrl + "/api/group/modify/joincodes/remove";

  statsMemberGrowthUrl = environment.backendAppUrl + "/api/group/stats/member-growth";
  statsProvincesUrl = environment.backendAppUrl + "/api/group/stats/provinces";
  statsSourcesUrl = environment.backendAppUrl + "/api/group/stats/sources";
  statsOrganisationsUrl = environment.backendAppUrl + "/api/group/stats/organisations";
  statsMemberDetailsUrl = environment.backendAppUrl + "/api/group/stats/member-details";
  statsTopicInterestsUrl = environment.backendAppUrl + "/api/group/stats/topic-interests";

  groupSearchUserByTermUrl = environment.backendAppUrl + "/api/user/related/user/names";

  private groupInfoList_: BehaviorSubject<GroupInfo[]> = new BehaviorSubject(null);
  public groupInfoList: Observable<GroupInfo[]> = this.groupInfoList_.asObservable();
  private groupInfoListError_: BehaviorSubject<any> = new BehaviorSubject(null);
  public groupInfoListError: Observable<any> = this.groupInfoListError_.asObservable();

  private groupMemberAdded_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public groupMemberAdded: Observable<boolean> = this.groupMemberAdded_.asObservable();

  private shouldReloadPaginationNumbers_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public shouldReloadPaginationNumbers: Observable<boolean> = this.shouldReloadPaginationNumbers_.asObservable();

  private newMembersInMyGroups_: BehaviorSubject<MembersPage> = new BehaviorSubject<MembersPage>(null);
  public newMembersInMyGroups: Observable<MembersPage> = this.newMembersInMyGroups_.asObservable();
  private newMembersInMyGroupsError_: BehaviorSubject<any> = new BehaviorSubject<MembersPage>(null);
  public newMembersInMyGroupsError: Observable<any> = this.newMembersInMyGroupsError_.asObservable();

  private NEW_MEMBERS_DATA_CACHE = "NEW_MEMBERS_DATA_CACHE";
  private MY_GROUPS_DATA_CACHE = "MY_GROUPS_DATA_CACHE";

  constructor(private httpClient: HttpClient, private userService: UserService) {

    let cachedMyGroups = localStorage.getItem(this.MY_GROUPS_DATA_CACHE);
    if (cachedMyGroups) {
      let cachedMyGroupsData = JSON.parse(localStorage.getItem(this.MY_GROUPS_DATA_CACHE));
      console.log("cachedMyGroupsData before", cachedMyGroupsData);
      cachedMyGroupsData = cachedMyGroupsData.map(gr => GroupInfo.createInstance(gr));
      console.log("cachedMyGroupsData after", cachedMyGroupsData);
      this.groupInfoList_.next(cachedMyGroupsData);
    }

    let cachedNewMembers = localStorage.getItem(this.NEW_MEMBERS_DATA_CACHE);
    if (cachedNewMembers) {
      let cachedNewMembersData = JSON.parse(localStorage.getItem(this.NEW_MEMBERS_DATA_CACHE));
      cachedNewMembersData.content = cachedNewMembersData.content.map(membership => Membership.createInstance(membership));
      this.newMembersInMyGroups_.next(cachedNewMembersData);
    }
  }

  loadGroups() {

    const fullUrl = this.groupListUrl;

    return this.httpClient.get<GroupInfo[]>(fullUrl)
      .map(
        data => data.map(gr => GroupInfo.createInstance(gr))
      )
      .subscribe(
        groups => {
          this.groupInfoList_.next(groups);
          localStorage.setItem(this.MY_GROUPS_DATA_CACHE, JSON.stringify(groups));
        },
        error => {
          this.groupInfoListError_.next(error);
          console.log("Error loading groups", error)
        });
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
            getGroupMembersList(gr.subGroups),
            gr.topics,
            gr.affiliations,
            gr.joinWords,
            gr.joinWordsLeft,
            gr.reminderMinutes,
            gr.profileImageUrl
          );
        }
      );
  }


  createGroup(name: string, description: string, permissionTemplate: string, reminderMinutes: number, discoverable: string,
              pinGroup: boolean = true): Observable<GroupRef> {

    const fullUrl = this.groupCreateUrl;

    let params = new HttpParams()
      .set('name', name)
      .set('description', description)
      .set('permissionTemplate', permissionTemplate)
      .set('reminderMinutes', reminderMinutes.toString())
      .set('discoverable', discoverable)
      .set('defaultAddToAccount', 'true')
      .set("pinGroup", pinGroup.toString());

    return this.httpClient.post<GroupRef>(fullUrl, null, {params: params});
  }


  fetchGroupMembers(groupUid: string, pageNo: number, pageSize: number, sort: string[]): Observable<MembersPage> {
    let params = new HttpParams()
      .set('groupUid', groupUid)
      .set('page', pageNo.toString())
      .set('size', pageSize.toString());

    if(sort[1] != ""){
      params = params.set('sort', sort.join(','));
    }

    return this.httpClient.get<MembersPage>(this.groupMemberListUrl, {params: params})
      .map(
        result => {
          let transformedContent = result.content.map(m => Membership.createInstance(m));
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

  fetchNewMembers(howRecentlyJoinedInDays: number, pageNo: number, pageSize: number) {
    console.log("Fetching new members");
    let params = new HttpParams()
      .set('howRecentInDays', howRecentlyJoinedInDays.toString())
      .set('page', pageNo.toString())
      .set('size', pageSize.toString())
      .set('sort', 'joinTime,desc');

    this.httpClient.get<MembersPage>(this.newMembersLIstUrl, {params: params})
      .map(
        result => {
          console.log("Fetched new members", result);
          let transformedContent = result.content.map(m => Membership.createInstance(m));
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
      )
      .subscribe(
        newMembersPage => {
          this.newMembersInMyGroups_.next(newMembersPage);
          localStorage.setItem(this.NEW_MEMBERS_DATA_CACHE, JSON.stringify(newMembersPage));
        },
        error => {
          console.log("Failed to fetch new members", error);
          this.newMembersInMyGroupsError_.next(error);
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
    const fullUrl = this.groupAssignTopicsToMembersUrl + "/" + groupUid;
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

  uploadGroupImage(groupUid, image): Observable<any> {
    const fullUrl = this.groupUploadImageUrl + "/" + groupUid;
    console.log("returning post to: ", fullUrl);
    return this.httpClient.post(fullUrl, image, { responseType: 'text' });
  }

  importHeaderAnalyze(file, params):Observable<GroupMembersImportExcelSheetAnalysis>{
    return  this.httpClient.post<GroupMembersImportExcelSheetAnalysis>(this.groupImportMembersAnalyzeUrl, file, {params: params})
      .map(response => {
          return response;
        }
      );
  }

  importAnalyzeMembers(params): Observable<FileImportResult>{
    return this.httpClient.post<FileImportResult>(this.groupImportMembersConfirmUrl, null, {params: params})
      .map(data => {
          console.log("import result back: ", data);
          return new FileImportResult(data.processedMembers.map(getAddMemberInfo), data.errorRows, data.errorFilePath);
        }
      )
  }

  downloadImportErrors(errorPath: string) {
    return this.httpClient.get(this.groupImportErrorsDownloadUrl, { params: { errorFilePath: errorPath }, responseType: 'blob' });
  }

  confirmAddMembersToGroup(groupUid: string, membersInfoToAdd: GroupAddMemberInfo[], joinMethod: string):Observable<GroupModifiedResponse>{
    const fullUrl = this.groupMembersAddUrl + "/" + groupUid;
    const params = new HttpParams().set("joinMethod", joinMethod);
    membersInfoToAdd.forEach(member => member.phoneNumber = PhoneNumberUtils.convertIfPhone(member.phoneNumber));
    console.log("posting members: ", membersInfoToAdd);
    return this.httpClient.post<GroupModifiedResponse>(fullUrl, membersInfoToAdd, { params: params })
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
    const inboundUrl = environment.frontendAppUrl + "/join/group/" + groupUid + "?code=" + joinWord;
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

  fetchTopicInterestsStats(groupUid: string): Observable<any> {

    const fullUrl = this.statsTopicInterestsUrl;
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

  searchForUsers(searchTerm: string): Observable<GroupRelatedUserResponse[]> {
    let params = new HttpParams()
      .set('fragment', searchTerm);

    return this.httpClient.get<GroupRelatedUserResponse[]>(this.groupSearchUserByTermUrl, {params: params})
      .map(resp => {
        return resp;
      })
  }

  fetchGroupMemberByMemberUid(groupUid:string, memberUid: string): Observable<Membership> {
    const fullUrl = this.groupFetchMemberByMemberUidUrl + '/' + groupUid;

    let params = new HttpParams()
      .set("memberUid", memberUid);

    return this.httpClient.get<Membership>(fullUrl, {params: params})
      .map(m => {
        return Membership.createInstance(m);
      } )
  }

  fetchMemberActivity(groupUid: string, memberUid: string): Observable<GroupMemberActivity[]>{
    const fullUrl = this.groupFetchMemberActivityUrl + '/' + groupUid;

    let params = new HttpParams()
      .set("memberUid", memberUid);

    return this.httpClient.get<GroupMemberActivity[]>(fullUrl, {params: params})
      .map(resp => {
        return resp.map(a => new GroupMemberActivity(
          a.groupUid,
          a.memberUid,
          a.actionLogType,
          a.taskType,
          a.logSubType,
          a.nameOfRelatedEntity,
          a.auxField,
          a.dateOfLog != null ? DateTimeUtils.getDateFromJavaInstant(a.dateOfLog) : null,
          a.dateOfLogEpochMillis,
          a.topics
        ));
      })
  }

  updateGroupMemberRole(groupUid: string, memberUid: string, role: string): Observable<Membership>{
    const fullUrl = this.groupMemberChangeRoleUrl + '/' + groupUid;

    let params = new HttpParams()
      .set("memberUid", memberUid)
      .set("roleName", role);

    return this.httpClient.post<Membership>(fullUrl, null, {params: params})
      .map(resp =>  {
        return resp;
      })
  }

  updateGroupMemberDetails(groupUid: string, memberUid: string, name: string, email: string, phone: string, province: string):Observable<Membership>{
    const fullUrl = this.groupMemberChangeDetailsUrl + '/' + groupUid;
    let params = new HttpParams()
      .set("memberUid", memberUid)
      .set("name", name)
      .set("email", email)
      .set("phone", phone)
      .set("province", province != null ? province : "");

    return this.httpClient.post<Membership>(fullUrl, null, {params: params})
      .map(resp => {
        return resp;
      })
  }

  updateGroupMemberAssignments(groupUid: string, memberUid: string, taskTeams: string[], affiliations: string[], topics: string[]) {
    const fullUrl = this.groupMemberChangeAssignmentsUrl + '/' + groupUid;
    let params = new HttpParams()
      .set("memberUid", memberUid)
      .set('taskTeams', taskTeams.toString())
      .set("affiliations", affiliations.toString())
      .set("topics", topics.toString());

    return this.httpClient.post(fullUrl, null, {params: params});

  }

  filterGroupMembers(groupUid: string,
                     filter: MembersFilter): Observable<Membership[]> {

    let params = new HttpParams()
      .set("groupUid", groupUid);

    if (filter.provinces != null) {
      params = params.set("provinces", filter.provinces.join(","));
    }

    if (filter.taskTeams != null) {
      params = params.set("taskTeams", filter.taskTeams.join(","));
    }

    if (filter.topics != null) {
      params = params.set("topics", filter.topics.join(","));
    }

    if (filter.affiliations != null) {
      params = params.set("affiliations", filter.affiliations.join(","));
    }

    if (filter.joinSources != null) {
      params = params.set("joinMethods", filter.joinSources.join(","));
    }

    if (filter.campaigns != null) {
      params = params.set("joinedCampaignsUids", filter.campaigns.join(","));
    }

    if (filter.joinDate != null) {
      params = params.set("joinDate", filter.joinDate.format("YYYY-MM-DD"));
      params = params.set("joinDaysAgoCondition", filter.joinDateCondition)
    }
    else if (filter.joinDaysAgo != null) {
      params = params.set("joinDaysAgo", filter.joinDaysAgo.toString());
      params = params.set("joinDaysAgoCondition", filter.joinDateCondition)
    }

    if (filter.namePhoneOrEmail != null && filter.namePhoneOrEmail.trim().length > 0) {
      params = params.set("namePhoneOrEmail", filter.namePhoneOrEmail);
    }

    return this.httpClient.get<Membership[]>(this.groupFilterMembersUrl, {params: params})
      .map(resp => resp.map(m => Membership.createInstance(m)))
  }

  createTaskTeam(parentUid: string, taskTeamName: string, memberUids: string[]):Observable<any>{
    const fullUrl = this.groupCreateTaskTeamUrl + '/' + parentUid;

    let params = new HttpParams()
      .set("taskTeamName", taskTeamName)
      .set("memberUids", memberUids.join(","));

    return this.httpClient.post<any>(fullUrl, null, {params: params})
      .map(resp => {
        return resp;
      })
  }

  groupMemberAddedSuccess(success: boolean){
    this.groupMemberAdded_.next(success);
  }

  shouldReloadPaginationPagesNumbers(reload: boolean){
    this.shouldReloadPaginationNumbers_.next(reload);
  }
}


