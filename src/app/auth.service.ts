import { Injectable } from '@angular/core';
import { tokenNotExpired} from 'angular2-jwt';
import {Http, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs/Observable";


@Injectable()
export class AuthService {

  constructor(private http:Http) { }

  loginUrl: string = environment.backendAppUrl + "/api/auth/web-login";

  login(user: string, password: string) : Observable<Response> {

    var rop = new RequestOptions();
    const params = new URLSearchParams() ;
    params.append("phoneNumber", user);
    params.append("password", password);
    rop.params = params;

    return this.http.get(this.loginUrl, rop)

  }


  logout(): any {
    localStorage.removeItem('token');
  }



  isLoggedIn(): boolean {
    return tokenNotExpired()
  }

}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];

