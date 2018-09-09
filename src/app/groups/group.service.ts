import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject, concat, from} from 'rxjs';
import { map, filter, first } from 'rxjs/operators';
import {environment} from 'environments/environment';
import {GroupInfo} from './model/group-info.model';
import {getGroupEntity, Group} from './model/group.model';
import {HttpClient, HttpParams} from '@angular/common/http';
import {DateTimeUtils} from '../utils/DateTimeUtils';
import {Membership, MembersPage, transformMemberPage} from './model/membership.model';
import {GroupMembersImportExcelSheetAnalysis} from './model/group-members-import-excel-sheet-analysis.model';
import {getAddMemberInfo, GroupAddMemberInfo} from './model/group-add-member-info.model';
import {GroupModifiedResponse} from './model/group-modified-response.model';
import {GroupRef} from './model/group-ref.model';
import {JoinCodeInfo} from './model/join-code-info';
import {GroupPermissionsByRole} from './model/permission.model';
import {GroupRelatedUserResponse} from './model/group-related-user.model';
import {GroupMemberActivity} from './model/group-member-activity';
import {MembersFilter} from "./member-filter/filter.model";
import {PhoneNumberUtils} from "../utils/PhoneNumberUtils";
import {FileImportResult} from "./group-details/group-members/group-members-import/file-import/file-import-result";
import {GroupLog, GroupLogPage} from "./model/group-log.model";
import {Moment} from 'moment-mini-ts';
import {STORE_KEYS, LocalStorageService} from "../utils/local-storage.service";
import { UserExtraAccount } from '../user/account/account.user.model';


@Injectable()
export class GroupService {

  groupListUrl = environment.backendAppUrl + "/api/group/fetch/list";
  groupDetailsUrl = environment.backendAppUrl + "/api/group/fetch/details";
  taskTeamDetailsUrl = environment.backendAppUrl + "/api/group/fetch/details/taskteam";
  groupMemberListUrl = environment.backendAppUrl + "/api/group/fetch/members";
  groupMemberExportUrl = environment.backendAppUrl + "/api/group/fetch/export";
  newMembersListUrl = environment.backendAppUrl + "/api/group/fetch/members/new";
  groupMembersAddUrl = environment.backendAppUrl + "/api/group/modify/members/add";
  groupCreateUrl = environment.backendAppUrl + "/api/group/modify/create";
  groupPinUrl = environment.backendAppUrl + "/api/group/modify/pin";
  groupCopyMembersUrl = environment.backendAppUrl + '/api/group/modify/members/copy';
  groupUnpinUrl = environment.backendAppUrl + "/api/group/modify/unpin";
  groupRemoveMembersUrl = environment.backendAppUrl + "/api/group/modify/members/remove";
  groupAddMembersToTaskTeamUrl = environment.backendAppUrl + "/api/group/modify/members/add/taskteam";
  groupAssignTopicsToMembersUrl = environment.backendAppUrl + "/api/group/modify/members/add/topics";
  groupRemoveTopicsFromMembersUrl = environment.backendAppUrl + "/api/group/modify/members/remove/topics";
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
  groupFetchInboundMessagesUrl = environment.backendAppUrl + "/api/group/fetch/inbound-messages";
  groupDownloadInboundMessagesUrl = environment.backendAppUrl + "/api/group/fetch/inbound-messages";
  groupDownloadMembersErrorReportUrl = environment.backendAppUrl + "/api/group/fetch/members/error-report";

  groupFilterMembersUrl = environment.backendAppUrl + '/api/group/fetch/members/filter';
  groupCreateTaskTeamUrl = environment.backendAppUrl + '/api/group/modify/create/taskteam';
  groupRemoveTaskTeamUrl = environment.backendAppUrl + "/api/group/modify/deactivate/taskteam";
  groupRenametaskTeamUrl = environment.backendAppUrl + "/api/group/modify/rename/taskteam";
  groupUploadImageUrl = environment.backendAppUrl + "/api/group/modify/image/upload";
  groupDownloadFilteredMembersUrl = environment.backendAppUrl + "/api/group/fetch/members/filter/download";

  groupJoinWordsListUrl = environment.backendAppUrl + "/api/group/modify/joincodes/list/active";
  groupJoinWordAddUrl = environment.backendAppUrl + "/api/group/modify/joincodes/add";
  groupJoinWordRemoveUrl = environment.backendAppUrl + "/api/group/modify/joincodes/remove";

  statsMemberGrowthUrl = environment.backendAppUrl + "/api/group/stats/member-growth";
  statsProvincesUrl = environment.backendAppUrl + "/api/group/stats/provinces";
  statsSourcesUrl = environment.backendAppUrl + "/api/group/stats/sources";
  statsOrganisationsUrl = environment.backendAppUrl + "/api/group/stats/organisations";
  statsMemberDetailsUrl = environment.backendAppUrl + "/api/group/stats/member-details";
  statsTopicInterestsUrl = environment.backendAppUrl + "/api/group/stats/topic-interests";
  rawStatsTopicInterestsUrl = environment.backendAppUrl + "/api/group/stats/raw-topic-interests";

  groupSearchUserByTermUrl = environment.backendAppUrl + "/api/user/related/user/names";
  groupSetTopicsUrl = environment.backendAppUrl + "/api/group/modify/topics/set";
  groupSetJoinTopicsUrl = environment.backendAppUrl + "/api/group/modify/topics/join";
  
  groupFetchWelcomeMsgUrl = environment.backendAppUrl + "/api/group/modify/welcome/check";
  groupSetWelcomeMsgUrl = environment.backendAppUrl + "/api/group/modify/welcome/update";
  groupClearWelcomeMsgUrl = environment.backendAppUrl + "/api/group/modify/welcome/clear";
  groupMemberUnsubscribeUrl = environment.backendAppUrl + "/api/group/modify/member/unsubscribe";
  groupMemberAliasUpdateUrl = environment.backendAppUrl + "/api/group/modify/member/alias/update";

  groupAddToUserAccountUrl = environment.backendAppUrl + "/api/account/add/group";

  groupHideUrl = environment.backendAppUrl + "/api/group/modify/hide";
  groupUnhideUrl = environment.backendAppUrl + "/api/group/modify/unhide";
  groupDeactivateUrl = environment.backendAppUrl + "/api/group/modify/deactivate";

  private groupInfoList_: BehaviorSubject<GroupInfo[]> = new BehaviorSubject(null);
  public groupInfoList: Observable<GroupInfo[]> = this.groupInfoList_.asObservable();
  private groupInfoListError_: BehaviorSubject<any> = new BehaviorSubject(null);
  public groupInfoListError: Observable<any> = this.groupInfoListError_.asObservable();

  private groupFullRetrieved_: Group[] = [];

  private groupMemberAdded_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public groupMemberAdded: Observable<boolean> = this.groupMemberAdded_.asObservable();

  private shouldReloadPaginationNumbers_: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public shouldReloadPaginationNumbers: Observable<boolean> = this.shouldReloadPaginationNumbers_.asObservable();

  private newMembersInMyGroups_: BehaviorSubject<MembersPage> = new BehaviorSubject<MembersPage>(null);
  public newMembersInMyGroups: Observable<MembersPage> = this.newMembersInMyGroups_.asObservable();
  private newMembersInMyGroupsError_: BehaviorSubject<any> = new BehaviorSubject<MembersPage>(null);
  public newMembersInMyGroupsError: Observable<any> = this.newMembersInMyGroupsError_.asObservable();

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {

    let cachedMyGroups = this.localStorageService.getItem(STORE_KEYS.MY_GROUPS_DATA_CACHE);
    if (cachedMyGroups) {
      let cachedMyGroupsData = JSON.parse(this.localStorageService.getItem(STORE_KEYS.MY_GROUPS_DATA_CACHE));
      // console.log("cachedMyGroupsData before", cachedMyGroupsData);
      cachedMyGroupsData = cachedMyGroupsData ? cachedMyGroupsData.map(gr => GroupInfo.createInstance(gr)) : [];
      // console.log("cachedMyGroupsData after", cachedMyGroupsData);
      this.groupInfoList_.next(cachedMyGroupsData);
    }

    let cachedNewMembers = this.localStorageService.getItem(STORE_KEYS.NEW_MEMBERS_DATA_CACHE);
    // console.log('cached new members: ', cachedNewMembers);
    if (cachedNewMembers) {
      let cachedNewMembersData = JSON.parse(cachedNewMembers);
      // console.log('cached new members data : ', cachedNewMembersData);
      cachedNewMembersData.content = (cachedNewMembers.content && cachedNewMembers.content.map === 'function') ?
        cachedNewMembersData.content.map(membership => Membership.createInstance(membership)) : [];
      this.newMembersInMyGroups_.next(cachedNewMembersData);
    }
  }

  loadGroups() {
    const fullUrl = this.groupListUrl;
    return this.httpClient.get<GroupInfo[]>(fullUrl).pipe(map(data => data.map(GroupInfo.createInstance))).subscribe(
        groups => {
          const visibleGroups = groups.filter(group => !group.hidden);
          this.groupInfoList_.next(visibleGroups);
          this.localStorageService.setItem(STORE_KEYS.MY_GROUPS_DATA_CACHE, JSON.stringify(visibleGroups));
        },
        error => {
          this.groupInfoListError_.next(error);
          console.log("Error loading groups", error)
        });
  }

  loadGroupDetailsCached(groupUid: string, checkServerAfter: boolean = true): Observable<Group> {
    let concatObs = concat(
      this.checkGroupCache(groupUid),
      this.loadGroupDetailsFromServer(groupUid));
    return checkServerAfter ? concatObs : concatObs.pipe(first());
  }

  checkGroupCache(groupUid: string): Observable<Group> {
    return from(this.groupFullRetrieved_).pipe(filter(grp => grp.groupUid == groupUid));
  }

  loadGroupDetailsFromServer(groupUid: string): Observable<Group> {
    const fullUrl = this.groupDetailsUrl + "/" + groupUid;
    return this.httpClient.get<Group>(fullUrl)
      .pipe(map(
        gr => {
          let group = getGroupEntity(gr);
          let existingIndex = this.groupFullRetrieved_.findIndex(grp => grp.groupUid == group.groupUid);
          if (existingIndex != -1) {
            this.groupFullRetrieved_[existingIndex] = group;
          } else {
            this.groupFullRetrieved_.push(group);
          }
          return group;
        }
      ));
  }

  loadTaskTeamDetails(parentUid: string, taskTeamUid: string): Observable<Group> {
    const fullUrl = this.taskTeamDetailsUrl + "/" + parentUid;
    let params = new HttpParams().set("taskTeamUid", taskTeamUid);
    // don't cache it, for the moment, as rare, and no need to crowd
    return this.httpClient.get<Group>(fullUrl, {params: params}).pipe(map(getGroupEntity));
  }

  createGroup(name: string,
              description: string = "",
              permissionTemplate: string = "CLOSED_GROUP",
              reminderMinutes: number = 1440,
              discoverable: string = "false",
              pinGroup: boolean = false): Observable<GroupRef> {

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
      .pipe(map(transformMemberPage));
  }

  downloadGroupMembers(groupUid: string) {
    const fullUrl = this.groupMemberExportUrl + "/" + groupUid;
    return this.httpClient.get(fullUrl, { responseType: 'blob' });
  }

  downloadFilteredGroupMembers(groupUid: string, filteredMemberUids: string[]) {
    const fullUrl = this.groupDownloadFilteredMembersUrl + "/" + groupUid;
    // let params = new HttpParams().set('filteredMemberUids', filteredMemberUids.join(','));
    return this.httpClient.post(fullUrl, filteredMemberUids, { responseType : 'blob' });
  }

  fetchNewMembers(howRecentlyJoinedInDays: number, pageNo: number, pageSize: number) {
    console.log('Fetching new members from server');
    let params = new HttpParams()
      .set('howRecentInDays', howRecentlyJoinedInDays.toString())
      .set('page', pageNo.toString())
      .set('size', pageSize.toString())
      .set('sort', 'joinTime,desc');

    this.httpClient.get<MembersPage>(this.newMembersListUrl, {params: params})
      .pipe(map(transformMemberPage))
      .subscribe(newMembersPage => {
          console.log('new members page from server: ', newMembersPage);
          this.newMembersInMyGroups_.next(newMembersPage);
          this.localStorageService.setItem(STORE_KEYS.NEW_MEMBERS_DATA_CACHE, JSON.stringify(newMembersPage));
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
    return this.httpClient.post<boolean>(fullUrl, null, {params: params});
  }

  addMembersToTaskTeam(parentGroupUid: string, childGroupUid: string, membersUids: string[]): Observable<boolean> {
    const fullUrl = this.groupAddMembersToTaskTeamUrl + "/" + parentGroupUid;
    const params = {
      'childGroupUid': childGroupUid,
      'memberUids': membersUids
    };

    return this.httpClient.post(fullUrl, null, {params: params}).pipe(map(_ => true));
  }

  // onlyAdd: if set to false, the passed topics will overwrite the prior topics for the members; if set to true, the
  // members will retain their existing topics
  assignTopicToMember(groupUid: string, membersUids: string[], topics: string[], applyToAll: boolean = false, onlyAdd: boolean = false): Observable<boolean> {
    const fullUrl = this.groupAssignTopicsToMembersUrl + "/" + groupUid;
    const params = new HttpParams().set('memberUids', membersUids.join(','))
      .set('topics', topics.join(','))
      .set('applyToAll', '' + applyToAll)
      .set('onlyAdd', '' + onlyAdd);
    console.log("posting topic assignment ...");

    return this.httpClient.post(fullUrl, null, {params: params}).pipe(map(() => true));
  }

  removeTopicFromMembers(groupUid: string, memberUids: string[], topics: string[], applyToAll: boolean = false): Observable<any> {
    const fullUrl = this.groupRemoveTopicsFromMembersUrl + "/" + groupUid;
    const params = new HttpParams().set('memberUids', memberUids.join(','))
      .set('applyToAll', '' + applyToAll)    
      .set('topics', topics.join(','));
    return this.httpClient.post(fullUrl, null, {params: params});
  }

  uploadGroupImage(groupUid, image): Observable<any> {
    const fullUrl = this.groupUploadImageUrl + "/" + groupUid;
    console.log("returning post to: ", fullUrl);
    return this.httpClient.post(fullUrl, image, { responseType: 'text' });
  }

  importHeaderAnalyze(file, params):Observable<GroupMembersImportExcelSheetAnalysis>{
    return this.httpClient.post<GroupMembersImportExcelSheetAnalysis>(this.groupImportMembersAnalyzeUrl, file, {params: params});
  }

  importAnalyzeMembers(params): Observable<FileImportResult>{
    return this.httpClient.post<FileImportResult>(this.groupImportMembersConfirmUrl, null, {params: params})
      .pipe(map(data => {
          return new FileImportResult(data.processedMembers.map(getAddMemberInfo), data.errorRows, data.errorFilePath);
        }
      ));
  }

  downloadImportErrors(errorPath: string) {
    return this.httpClient.get(this.groupImportErrorsDownloadUrl, { params: { errorFilePath: errorPath }, responseType: 'blob' });
  }

  confirmAddMembersToGroup(groupUid: string, membersInfoToAdd: GroupAddMemberInfo[], joinMethod: string):Observable<GroupModifiedResponse>{
    const fullUrl = this.groupMembersAddUrl + "/" + groupUid;
    const params = new HttpParams().set("joinMethod", joinMethod);
    membersInfoToAdd.forEach(member => member.phoneNumber = PhoneNumberUtils.convertIfPhone(member.phoneNumber));
    return this.httpClient.post<GroupModifiedResponse>(fullUrl, membersInfoToAdd, { params: params });
  }

  copyMembersFromGroupToOther(fromGroupUid: string, toGroupUid: string, keepTopics: boolean, addTopic: string): Observable<any> {
    const fullUrl = this.groupCopyMembersUrl + '/' + fromGroupUid;
    let params = new HttpParams().set('toGroupUid', toGroupUid).set('keepTopics', '' + keepTopics);
    if (addTopic)
      params = params.set('addTopic', addTopic);
    return this.httpClient.post(fullUrl, null, {params: params});
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

  fetchGroupWelcomeMessage(groupUid: string): Observable<string> {
    return this.httpClient.get(this.groupFetchWelcomeMsgUrl + "/" + groupUid, { responseType: 'text'});
  }

  setGroupWelcomeMessage(groupUid: string, message: string): Observable<any> {
    const fullUrl = this.groupSetWelcomeMsgUrl + "/" + groupUid;
    const params = new HttpParams().set("message", message);
    return this.httpClient.post(fullUrl, null, { params: params});
  }

  clearGroupWelcomeMessage(groupUid: string): Observable<any> {
    const fullUrl = this.groupClearWelcomeMsgUrl + "/" + groupUid;
    return this.httpClient.post(fullUrl, null);
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

  fetchRawTopicInterestsStats(groupUid: string): Observable<any> {

    const fullUrl = this.rawStatsTopicInterestsUrl;
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

    return this.httpClient.post<boolean>(fullUrl, null, {params: params});
  }

  updateGroupPermissionsForRole(updatedPermissionsByRole: any, groupUid: string): Observable<any> {
    const fullUrl = this.groupUpdatePermissionsForRole + '/' + groupUid;

    return this.httpClient.post<any>(fullUrl, updatedPermissionsByRole);
  }

  fetchGroupPermissionsToDisplay(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.groupFetchPermissionsDisplayedUrl);
  }

  fetchGroupPermissionsForRole(groupUid: string, roleName: string[]): Observable<GroupPermissionsByRole> {
    const fullUrl = this.groupFetchPermissionsForRoleUrl + '/' + groupUid;

    let params = new HttpParams()
      .set('roleNames', roleName.join(","));

    return this.httpClient.post<GroupPermissionsByRole>(fullUrl, null, {params: params})
      .pipe(map(resp => new GroupPermissionsByRole(resp)));
  }

  searchForUsers(searchTerm: string): Observable<GroupRelatedUserResponse[]> {
    let params = new HttpParams()
      .set('fragment', searchTerm);

    return this.httpClient.get<GroupRelatedUserResponse[]>(this.groupSearchUserByTermUrl, {params: params});
  }

  fetchGroupMemberByMemberUid(groupUid:string, memberUid: string): Observable<Membership> {
    const fullUrl = this.groupFetchMemberByMemberUidUrl + '/' + groupUid;

    let params = new HttpParams()
      .set("memberUid", memberUid);

    return this.httpClient.get<Membership>(fullUrl, {params: params})
      .pipe(map(m => Membership.createInstance(m)));
  }

  fetchMemberActivity(groupUid: string, memberUid: string): Observable<GroupMemberActivity[]>{
    const fullUrl = this.groupFetchMemberActivityUrl + '/' + groupUid;

    let params = new HttpParams()
      .set("memberUid", memberUid);

    return this.httpClient.get<GroupMemberActivity[]>(fullUrl, {params: params})
      .pipe(map(resp => {
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
      }));
  }

  updateGroupMemberRole(groupUid: string, memberUid: string, role: string): Observable<Membership>{
    const fullUrl = this.groupMemberChangeRoleUrl + '/' + groupUid;

    let params = new HttpParams()
      .set("memberUid", memberUid)
      .set("roleName", role);

    return this.httpClient.post<Membership>(fullUrl, null, {params: params});
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
      .pipe(map(resp => Membership.createInstance(resp)));
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

  filterGroupMembers(groupUid: string, filter: MembersFilter, maxSize?: number): Observable<MembersPage> {
    // console.log("filtering group members ...");

    let maxEntities = maxSize ? maxSize : 100;

    let params = new HttpParams()
      .set('groupUid', groupUid)
      .set('maxEntities', '' + maxEntities);

    if (filter.provinces != null) {
      params = params.set("provinces", filter.provinces.join(","));
    }

    if (filter.noProvince == 'UNKNOWN') {
      params = params.set('noProvince', 'true');
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

    if (filter.language != null) {
      params = params.set("languages", filter.language.join(","));
    }

    return this.httpClient.get<MembersPage>(this.groupFilterMembersUrl, {params: params})
      .pipe(map(transformMemberPage));
  }

  createTaskTeam(parentUid: string, taskTeamName: string, memberUids: string[]):Observable<any>{
    const fullUrl = this.groupCreateTaskTeamUrl + '/' + parentUid;

    let params = new HttpParams()
      .set("taskTeamName", taskTeamName)
      .set("memberUids", memberUids.join(","));

    return this.httpClient.post<any>(fullUrl, null, {params: params});
  }

  setGroupTopics(groupUid: string, topics: string[]): Observable<any> {
    const fullUrl = this.groupSetTopicsUrl + "/" + groupUid;

    let params = new HttpParams()
      .set("topics", topics.join(","));

    return this.httpClient.post<any>(fullUrl, null, {params: params});
  }

  setJoinTopics(groupUid: string, joinTopics: string[]): Observable<any> {
    const fullUrl = this.groupSetJoinTopicsUrl + "/" + groupUid;
    let params = new HttpParams().set("joinTopics", joinTopics.join(","));
    return this.httpClient.post<any>(fullUrl, null, {params: params});
  }

  removeTaskTeam(parentUid: string, taskTeamUid: string): Observable<Group> {
    const fullUrl = this.groupRemoveTaskTeamUrl + "/" + parentUid;
    let params = new HttpParams().set("taskTeamUid", taskTeamUid);
    return this.httpClient.post<Group>(fullUrl, null, {params: params});
  }

  renameTaskTeam(parentUid: string, taskTeamUid: string, newName: string): Observable<any> {
    const fullUrl = this.groupRenametaskTeamUrl + "/" + parentUid;
    let params = new HttpParams().set("taskTeamUid", taskTeamUid).set("newName", newName);
    return this.httpClient.post(fullUrl, null, {params: params});
  }

  groupMemberAddedSuccess(success: boolean){
    this.groupMemberAdded_.next(success);
  }

  shouldReloadPaginationPagesNumbers(reload: boolean){
    this.shouldReloadPaginationNumbers_.next(reload);
  }

  fetchInboundMessagesForGroup(groupUid: string, pageNo: number, from: Moment, to: Moment, keyword: string, sort: string[]): Observable<GroupLogPage> {
    const fullUrl = this.groupFetchInboundMessagesUrl + '/' + groupUid;
    let params = new HttpParams()
      .set('page', pageNo.toString())
      .set('size', "10");

    if(from != null) {
      params = params.set('from', from.valueOf().toString());
    }

    if(to != null) {
      params = params.set('to', to.valueOf().toString());
    }

    if(keyword != null) {
      params = params.set('keyword', keyword);
    }

    if(sort[1] != ""){
      params = params.set('sort', sort.join(','));
    }

    return this.httpClient.get<GroupLogPage>(fullUrl, {params: params}).pipe(map(
      result => {
        console.log(result);
        let transformedContent = result.content.map(gl => GroupLog.createInstance(gl));
        return new GroupLogPage(
          result.number,
          result.totalPages,
          result.totalElements,
          result.size,
          result.first,
          result.last,
          transformedContent
        );
      }
    ));
  }

  exportInboundMessages(groupUid: string, from: Moment, to: Moment, keyword: string) {
    const fullUrl = this.groupDownloadInboundMessagesUrl + '/' + groupUid + '/download';
    let params = new HttpParams();

    if(from != null) {
      params = params.set('from', from.valueOf().toString());
    }

    if(to != null) {
      params = params.set('to', to.valueOf().toString());
    }

    if(keyword != null) {
      params = params.set('keyword', keyword);
    }

    return this.httpClient.get(fullUrl, { params: params, responseType: 'blob' });
  }

  downloadErrorReport(groupUid: string) {
    const fullUrl = this.groupDownloadMembersErrorReportUrl + '/' + groupUid + '/download';
    return this.httpClient.get(fullUrl, { responseType: 'blob' });
  }

  unsubscribeUser(groupUid: string):Observable<any>{
    let params = new HttpParams().set("groupUid",groupUid);
    return this.httpClient.post(this.groupMemberUnsubscribeUrl,null,{params:params,responseType:'text'});
  }

  hideGroup(groupUid: string) {
    const fullUrl = this.groupHideUrl + '/' + groupUid;
    return this.httpClient.post(fullUrl, null, { responseType: 'text' });
  }

  unhideGroup(groupUid: string) {
    const fullUrl = this.groupUnhideUrl + '/' + groupUid;
    return this.httpClient.post(fullUrl, null, { responseType: 'text' });
  }

  deactivateGroup(groupUid: string) {
    const fullUrl = this.groupDeactivateUrl + '/' + groupUid;
    return this.httpClient.post(fullUrl, null, { responseType: 'text' });
  }

  updateMemberAlias(grouoUid:string, alias:string):Observable<any>{
    let params = new HttpParams()
        .set("groupUid",grouoUid)
        .set("alias",alias);

    return this.httpClient.post(this.groupMemberAliasUpdateUrl,null,{params:params,responseType:'text'});
  }

  addToAccount(groupUid: string): Observable<Boolean> {
    let params = new HttpParams().set('groupUids', groupUid);
    return this.httpClient.post<UserExtraAccount>(this.groupAddToUserAccountUrl, null, {params: params}).pipe(map(changedAccount => {
      let indexOfGroup = Object.keys(changedAccount.paidForGroups).findIndex(uid => uid == groupUid);
      console.log('found index? : ', indexOfGroup);
      if (indexOfGroup != -1) {
        this.loadGroupDetailsFromServer(groupUid); // to refresh it
        return true;
      } else {
        console.log('Group not added to account, must already be paid for');
        return false;
      }
    }));
  }

  removeGroupCached(groupUid: string) {
    const cachedMyGroups = this.localStorageService.getItem(STORE_KEYS.MY_GROUPS_DATA_CACHE);
    if (cachedMyGroups) {
      console.log('removing a cached group ...');
      const remainingGroups = JSON.parse(this.localStorageService.getItem(STORE_KEYS.MY_GROUPS_DATA_CACHE))
        .filter(group => group.uid !== groupUid);
      console.log(`after filter, have ${remainingGroups.length} groups left`);
      this.groupInfoList_.next(remainingGroups);
      this.localStorageService.setItem(STORE_KEYS.MY_GROUPS_DATA_CACHE, JSON.stringify(remainingGroups));
    }
    this.loadGroups();
  }

}


