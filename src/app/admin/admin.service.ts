import { Injectable } from '@angular/core';
import {environment} from "environments/environment";
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from "rxjs";
import {GroupAdmin} from "../groups/model/group-admin.model";
import { map } from 'rxjs/operators';
import { ConfigVariable } from './system-admin/config-variable.model';

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
  private recycleGroupJoinTokensUrl = environment.backendAppUrl + "/api/admin/groups/tokens/recycle";
  private fetchApiCallTokenUrl = environment.backendAppUrl + "/api/admin/token/system/generate";
  private exportWhatsappOptedIn = environment.backendAppUrl + "/api/user/export/whatsapp/users";

  private createConfigVariableUrl = environment.backendAppUrl + "/api/admin/config/create";
  private updateConfigVariableUrl = environment.backendAppUrl + "/api/admin/config/update";
  private fetchConfigVarsUrl = environment.backendAppUrl + "/api/admin/config/fetch";
  private deleteCVUrl = environment.backendAppUrl + "/api/admin/config/delete";

  private numberGroupsAboveLimitUrl = environment.backendAppUrl + "/api/admin/config/fetch/above/limit";
  private numberGroupsBelowLimitUrl = environment.backendAppUrl + "/api/admin/config/fetch/below/limit";

  private numberGroupsBelowLimitWithUserInputUrl = environment.backendAppUrl + "/api/admin/config/fetch/below/limit";
  private numberGroupsAboveLimitWithUserInputUrl = environment.backendAppUrl + "/api/admin/config/fetch/above/limit";

  private listAllConfigVarialbeUrl = environment.backendAppUrl + "/api/admin/config/fetch/list";

  private triggerMunicipalityFetchBatchUrl = environment.backendAppUrl + "/api/admin/municipalities/trigger";
  private countUsersWithLocationLogs = environment.backendAppUrl + "/api/group/fetch/users/location/timeStamp";

  private saveUserLocationLogsFromAddressUrl = environment.backendAppUrl + "/api/admin/update/location/address";

  private sendMessageToGroupOrganizersUrl = environment.backendAppUrl + "/api/admin/message/organizers";

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
      .pipe(map(group => group.map(grp => GroupAdmin.createInstance(grp))));
  }

  deactivateGroup(groupUid:string):Observable<string>{
    let params = new HttpParams().set('groupUid',groupUid);
    return this.httpClient.post(this.deactivateGroupUrl,null,{responseType:'text',params:params});
  }

  activateGroup(groupUid:string):Observable<string>{
    let params = new HttpParams().set('groupUid',groupUid);
    return this.httpClient.post(this.activateGroupUrl,null,{responseType:'text',params:params});
  }

  recycleGroupJoinCodes():Observable<string> {
    return this.httpClient.post(this.recycleGroupJoinTokensUrl, null, {responseType: 'text'});
  }

  addMember(phoneNumber:string, displayName:string, roleName:string, groupUid:string, email:string, province:string):Observable<any>{


    let params = new HttpParams()
      .set('groupUid',groupUid)
      .set('displayName',displayName)
      .set('phoneNumber',phoneNumber)
      .set('roleName',roleName)
      .set('email',email);

    if (!!province) {
      params = params.set('province', province);
    }

    return this.httpClient.post(this.addMemberToGroupUrl,null,{responseType:'text',params:params});
  }

  numberOfGroupsUserIsPartOf(userUid:string):Observable<any>{
    let params = new HttpParams().set('userUid',userUid);
    return this.httpClient.get(this.numberOfGroupsUserIsPartOfUrl,{params:params});
  }

  fetchAccessToken(): Observable<string> {
    return this.httpClient.post(this.fetchApiCallTokenUrl, null, { responseType: 'text'});
  }

  downloadWhatsAppOptedInUsers(){
      const params = new HttpParams();
      return this.httpClient.get(this.exportWhatsappOptedIn, {params: params, responseType: 'blob'});
  }

  createConfigVariable(key:string,value:string,description:string): Observable<any>{
    let params = new HttpParams()
      .set("key",key)
      .set("value",value)
      .set('description',description);
    
    return this.httpClient.post(this.createConfigVariableUrl,null,{params:params});
  }

  updateConfigVariable(key:string,value:string,description:string): Observable<any>{
    let params = new HttpParams()
      .set("key",key)
      .set("value",value)
      .set('description',description);

    return this.httpClient.post(this.updateConfigVariableUrl,null,{params:params});
  }

  fetchConfigVariables(): Observable<Map<string,string>>{
    return this.httpClient.get<Map<string,string>>(this.fetchConfigVarsUrl);
  }

  listAllConfigVariables(): Observable<ConfigVariable[]>{
    return this.httpClient.get<ConfigVariable[]>(this.listAllConfigVarialbeUrl)
      .pipe(map(resp => resp.map(configVar => ConfigVariable.createInstance(configVar))));
  }

  deleteCV(key:string): Observable<any> {
    let params = new HttpParams()
      .set("key",key);
    return this.httpClient.post(this.deleteCVUrl,null,{params:params});
  }

  getNumberGroupsAboveFreeLimit(): Observable<any> {
    return this.httpClient.get(this.numberGroupsAboveLimitUrl);
  }

  getNumberGroupsBelowFreeLimit(): Observable<any> {
    return this.httpClient.get(this.numberGroupsBelowLimitUrl);
  }

  countGroupsBelowLimit(limit:number):Observable<any> {
    let fullUrl = this.numberGroupsBelowLimitWithUserInputUrl + "/" + limit;
    return this.httpClient.get(fullUrl);
  }

  countGroupsAboveLimit(limit:number):Observable<any> {
    let fullUrl = this.numberGroupsAboveLimitWithUserInputUrl + "/" + limit;
    return this.httpClient.get(fullUrl);
  }
  // loading/refreshing users with gps coordinates (cache)
  triggerMunicipalityFetch(batchSize: number): Observable<any>{
    const params = new HttpParams().set('pageSize', '' + batchSize);
    return this.httpClient.get(this.triggerMunicipalityFetchBatchUrl, {params: params});
  }

  // Fetching all users counts that have the gps coordinates
  countAllUsersWithLocation(countAll:boolean): Observable<any>{
    let params = new HttpParams().set("countAll",countAll +"")
    return this.httpClient.get(this.countUsersWithLocationLogs,{params:params});
  }

  // filles in locations for users who have an address entity but not coordinates related to themselves
  saveUserLocationsFromAddress(batchSize: number): Observable<any>{
    const params = new HttpParams().set('pageSize', '' + batchSize);
    return this.httpClient.get(this.saveUserLocationLogsFromAddressUrl, {params: params});
 }

  sendMessageToGroupOrganizers(messageText: string, notDryRun = false): Observable<any> {
    const params = new HttpParams().set('message', messageText).set('notDryRun', '' + notDryRun);
    return this.httpClient.post(this.sendMessageToGroupOrganizersUrl, null, { params: params });
  }
}
