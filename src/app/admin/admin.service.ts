import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import {GroupAdmin} from "../groups/model/group-admin.model";

@Injectable()
export class AdminService {

  private loadUsersUrl = environment.backendAppUrl + "/api/admin/user/load";
  private numberOfGroupsUserIsPartOfUrl = environment.backendAppUrl + "/api/admin/user/groups/number";
  private optOutUserUrl = environment.backendAppUrl + "/api/admin/user/optout";
  private resetUserPwdUrl = environment.backendAppUrl + "/api/admin/user/pwd/reset";
  private loadGroupsUrl = environment.backendAppUrl + "/api/admin/groups/search";
  private deactivateGroupUrl = environment.backendAppUrl + "/api/admin/groups/deactivate";
  private activateGroupUrl = environment.backendAppUrl + "/api/admin/groups/activate";
  private addMemberToGroupUrl = environment.backendAppUrl + "/api/admin/groups/member/add";
  
  private initiateUserGraphUrl = environment.backendAppUrl + "/api/admin/graph/transfer/users";
  private initiateGroupsGraphUrl = environment.backendAppUrl + "/api/admin/graph/transfer/groups";

  constructor(private httpClient: HttpClient) { }

  loadUser(searchTerm:string):Observable<string>{
    let params = new HttpParams().set('lookupTerm',searchTerm);
    return this.httpClient.get(this.loadUsersUrl,{responseType:'text',params:params});
  }
  
  optOutUser(otp:string,userToOptoutUid:string):Observable<string>{
    let params = new HttpParams()
      .set('otpEntered',otp)
      .set('userToOptOutUid',userToOptoutUid);
    return this.httpClient.post(this.optOutUserUrl,null,{responseType:'text',params:params});
  }
  
  resetUserPassword(otp:string,userToResetUid:string):Observable<string>{
    let params = new HttpParams()
      .set('userToResetUid',userToResetUid)
      .set('otpEntered',otp);
    return this.httpClient.post(this.resetUserPwdUrl,null,{responseType:'text',params:params});
  }

  findGroups(searchterm:string):Observable<GroupAdmin[]>{
    let params = new HttpParams()
      .set('searchTerm',searchterm);
    return this.httpClient.get<GroupAdmin[]>(this.loadGroupsUrl,{params:params})
      .map(group => group.map(grp => GroupAdmin.createInstance(grp)));
  }

  deactivateGroup(groupUid:string):Observable<string>{
    let params = new HttpParams().set('groupUid',groupUid);
    return this.httpClient.post(this.deactivateGroupUrl,null,{responseType:'text',params:params});
  }

  activateGroup(groupUid:string):Observable<string>{
    let params = new HttpParams().set('groupUid',groupUid);
    return this.httpClient.post(this.activateGroupUrl,null,{responseType:'text',params:params});
  }

  addMember(phoneNumber:string,displayName:string,roleName:string,groupUid:string,email:string,province:string):Observable<any>{
    let params = new HttpParams()
      .set('groupUid',groupUid)
      .set('displayName',displayName)
      .set('phoneNumber',phoneNumber)
      .set('roleName',roleName)
      .set('email',email)
      .set('province',province);

    return this.httpClient.post(this.addMemberToGroupUrl,null,{responseType:'text',params:params});
  }

  numberOfGroupsUserIsPartOf(userUid:string):Observable<any>{
    let params = new HttpParams().set('userUid',userUid);
    return this.httpClient.get(this.numberOfGroupsUserIsPartOfUrl,{params:params});
  }

  initiateUserGraphTransfer():Observable<any> {
    return this.httpClient.get(this.initiateUserGraphUrl);
  }

  initiateGroupGraphTransfer():Observable<any> {
    return this.httpClient.get(this.initiateGroupsGraphUrl);
  }
}
