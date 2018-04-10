import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from "rxjs/Observable";

@Injectable()
export class AdminService {

  private loadUsersUrl = environment.backendAppUrl + "/api/admin/user/load";
  private optOutUserUrl = environment.backendAppUrl + "/api/admin/user/optout";
  constructor(private httpClient: HttpClient) { }

  loadUser(searchTerm:string):Observable<any>{
    let params = new HttpParams().set('lookupTerm',searchTerm);
    return this.httpClient.get(this.loadUsersUrl,{params:params});
  }
  
  optOutUser(otp:string,userToOptoutUid:string):Observable<any>{
    let params = new HttpParams()
      .set('otpEntered',otp)
      .set('userToOptOutUid',userToOptoutUid);
    return this.httpClient.post(this.optOutUserUrl,null,{params:params});
  }
}
