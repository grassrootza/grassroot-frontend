import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import {HttpClient} from '@angular/common/http';
import {Task} from 'app/task/task.model';
import {GroupInfo} from "../groups/model/group-info.model";
import {getGroupEntity, Group} from "../groups/model/group.model";

@Injectable()
export class SearchService {

  private allUserTasksUrl = environment.backendAppUrl + "/api/search/userTasks";
  private allUserGroupsUrl = environment.backendAppUrl + "/api/search/groups";

  constructor(private httpClient: HttpClient) {
  }

  loadUserTasksUsingSearchTerm(userUid:string,searchTerm:string):Observable<Task[]>{
    let fullUrl = this.allUserTasksUrl + "/" + userUid + "/" + searchTerm;
    return this.httpClient.get<Task[]>(fullUrl)
      .map(resp => resp.map(task => Task.createInstanceFromData(task)));
  }

  loadUserGroupsUsingSearchTerm(userUid:string,searchTerm:string):Observable<GroupInfo[]>{
    let fullUrl = this.allUserGroupsUrl + "/" + userUid + "/" + searchTerm;
    return this.httpClient.get<GroupInfo[]>(fullUrl)
      .map(resp => resp.map(groupInfo => GroupInfo.createInstance(groupInfo)));
  }

  loadUserGroups(userUid:string,searchTerm:string):Observable<Group[]>{
    let fullUrl = this.allUserGroupsUrl + "/" + userUid + "/" + searchTerm;
    return this.httpClient.get<Group[]>(fullUrl).map(resp => resp.map(grp => getGroupEntity(grp)));
  }
}
