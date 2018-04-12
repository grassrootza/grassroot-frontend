import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from "rxjs/Observable";

@Injectable()
export class AdminService {

  private loadUsersUrl = environment.backendAppUrl + "/api/admin/user/load";
  private optOutUserUrl = environment.backendAppUrl + "/api/admin/user/optout";
  private resetUserPwdUrl = environment.backendAppUrl + "/api/admin/user/pwd/reset";
  
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
}
