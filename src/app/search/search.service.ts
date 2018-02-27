import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpParams} from '@angular/common/http';
import {Task} from 'app/task/task.model';
import {GroupInfo} from "../groups/model/group-info.model";
import {getGroupEntity, Group} from "../groups/model/group.model";
import {UserService} from "../user/user.service";

@Injectable()
export class SearchService {

  private allUserTasksUrl = environment.backendAppUrl + "/api/search/userTasks";
  private allUserGroupsUrl = environment.backendAppUrl + "/api/search/groups/private";
  private userPublicGroupsUrl = environment.backendAppUrl + "/api/search/groups/public";
  private publicMeetingsUrl = environment.backendAppUrl + "/api/search/publicMeetings";

  private joinGroupUrl = environment.backendAppUrl + "/api/search/join";

  constructor(private httpClient: HttpClient,
              private userService:UserService) {
  }

  loadUserTasksUsingSearchTerm(userUid:string,searchTerm:string):Observable<Task[]>{
    let fullUrl = this.allUserTasksUrl + "/" + userUid + "/" + searchTerm;
    console.log("Full tasks url...",fullUrl);
    return this.httpClient.get<Task[]>(fullUrl)
      .map(resp => resp.map(task => Task.createInstanceFromData(task)));
  }


  loadUserGroupsUsingSearchTerm(searchTerm:string):Observable<GroupInfo[]>{
    let fullUrl = this.allUserGroupsUrl;
    let params = new HttpParams().set("searchTerm", searchTerm);
    return this.httpClient.get<GroupInfo[]>(fullUrl, {params: params})
      .map(resp => resp.map(groupInfo => GroupInfo.createInstance(groupInfo)));
  }

  loadUserGroups(searchTerm:string):Observable<Group[]>{
    let fullUrl = this.allUserGroupsUrl;

    let params = new HttpParams().set("searchTerm", searchTerm);
    return this.httpClient.get<Group[]>(fullUrl, {params: params}).map(resp => resp.map(grp => getGroupEntity(grp)));
  }

  loadPublicGroups(searchTerm:string):Observable<Group[]>{
    let fullUrl = this.userPublicGroupsUrl;
    let params = new HttpParams().set("searchTerm", searchTerm)
      .set('searchByLocation',true + "");
    return this.httpClient.get<Group[]>(fullUrl,{params:params}).map(resp => resp.map(grp => getGroupEntity(grp)));
  }

  loadPublicMeetings(userUid:string,searchTerm:string):Observable<Task[]>{
    let fullUrl = this.publicMeetingsUrl + "/" + userUid + "/" + searchTerm;
    console.log("Full meetings url...",fullUrl);
    return this.httpClient.get<Task[]>(fullUrl)
      .map(resp => resp.map(task => Task.createInstanceFromData(task)));
  }

  askToJoinGroup(groupUid:string,word:string):Observable<any>{
    let fullUrl = this.joinGroupUrl + "/" +groupUid;

    let params = new HttpParams()
      .set("joinWord",word)
      .set("requestorUid",this.userService.getLoggedInUser().userUid);

    return this.httpClient.post(fullUrl,null,{params:params});
  }
}
