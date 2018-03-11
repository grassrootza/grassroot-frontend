import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpParams} from '@angular/common/http';
import {Task} from '../task/task.model';
import {getGroupEntity, Group} from "../groups/model/group.model";
import {UserService} from "../user/user.service";
import {TaskInfo} from "../task/task-info.model";
import {GroupRef,GroupMembersRef} from "../groups/model/group-ref.model";
import {GroupService} from "../groups/group.service";

@Injectable()
export class SearchService {

  private joinCodeRegex = /^\*?[0-9]{4}#?$|\*134\*1994\*[0-9]{4}#/;
  private codeNumbersRegex = /[0-9]{4}/g;

  private allUserTasksUrl = environment.backendAppUrl + "/api/search/tasks/user";
  private allUserGroupsUrl = environment.backendAppUrl + "/api/search/groups/private";
  private userPublicGroupsUrl = environment.backendAppUrl + "/api/search/groups/public";
  private publicMeetingsUrl = environment.backendAppUrl + "/api/search/meetings/public";

  private joinGroupUrl = environment.backendAppUrl + "/api/search/join";
  private checkIfGroupJoinCodeUrl = environment.backendAppUrl + "/api/search/group/check";
  private joinGroupUsingJoinCodeUrl = environment.backendAppUrl + "/api/search/group/join";

  constructor(private httpClient: HttpClient) {
  }

  loadUserTasksUsingSearchTerm(searchTerm:string):Observable<Task[]>{
    let params = new HttpParams().set("searchTerm", searchTerm);
    return this.httpClient.get<Task[]>(this.allUserTasksUrl, {params: params})
      .map(resp => resp.map(task => Task.createInstanceFromData(task)));
  }

  loadUserGroups(searchTerm:string):Observable<Group[]>{
    let fullUrl = this.allUserGroupsUrl;
    let params = new HttpParams().set("searchTerm", searchTerm);
    return this.httpClient.get<Group[]>(fullUrl, {params: params}).map(resp => resp.map(grp => getGroupEntity(grp)));
  }

  loadPublicGroups(searchTerm:string):Observable<Group[]>{
    let fullUrl = this.userPublicGroupsUrl;
    let params = new HttpParams().set("searchTerm", searchTerm)
      .set('useLocation', true + "");
    return this.httpClient.get<Group[]>(fullUrl,{params:params}).map(resp => resp.map(grp => getGroupEntity(grp)));
  }

  loadPublicMeetings(searchTerm:string):Observable<TaskInfo[]>{
    let params = new HttpParams().set("searchTerm", searchTerm);
    return this.httpClient.get<TaskInfo[]>(this.publicMeetingsUrl, {params: params})
      .map(resp => resp.map(task => TaskInfo.createInstance(task)));
  }

  askToJoinGroup(groupUid:string,word:string):Observable<any>{
    let fullUrl = this.joinGroupUrl + "/" + groupUid;

    let params = new HttpParams()
      .set("message",word);

    return this.httpClient.post(fullUrl,null,{params:params});
  }


  isSearchTermJoinCode(searchTerm:string):string{
    let code = null;
    if (this.joinCodeRegex.test(searchTerm)) {
      let numMatches = searchTerm.match(this.codeNumbersRegex);
      return numMatches[numMatches.length - 1];
    }
    return code;
  }

  findGroupWithJoinCode(joinCode:string):Observable<any>{
    let params = new HttpParams().set("joinCode",joinCode);
    return this.httpClient.get<GroupRef>(this.checkIfGroupJoinCodeUrl,{params:params})
        .map(resp => (resp) ? new GroupRef(resp.groupUid,resp.name,resp.memberCount) : resp);
  }

  joinWithCode(groupUid:string,joinCode:string):Observable<any>{
    let params = new HttpParams()
        .set("groupUid",groupUid)
        .set("joinCode",joinCode);

    return this.httpClient.post(this.joinGroupUsingJoinCodeUrl,null,{params:params});
  }

}
