import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {environment} from "../../environments/environment";
import {tokenNotExpired} from "angular2-jwt";

@Injectable()
export class UserService {

  private registerUrl = environment.backendAppUrl + "/api/user/web/register";
  private loginUrl: string = environment.backendAppUrl + "/api/auth/web-login";

  constructor(private http: Http) {
  }

  register(username: string, phoneNumber: string, password: string): Observable<Response> {

    var rop = new RequestOptions();
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("phoneNumber", phoneNumber);
    params.append("password", password);
    rop.params = params;

    return this.http.get(this.registerUrl, rop);
  }


  login(user: string, password: string): Observable<Response> {

    var rop = new RequestOptions();
    const params = new URLSearchParams();
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

  getLoggedInUser() {
    return localStorage.getItem("msisdn")
  }


}
