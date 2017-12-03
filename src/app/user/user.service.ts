import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http, RequestOptions, Response, URLSearchParams} from "@angular/http";
import {environment} from "../../environments/environment";
import {tokenNotExpired} from "angular2-jwt";
import {User} from "./user.model";

@Injectable()
export class UserService {

  private registerUrl = environment.backendAppUrl + "/api/user/web/register";
  private loginUrl: string = environment.backendAppUrl + "/api/auth/login-password";

  private _loggedInUser: User = null;
  public loggedInUser: EventEmitter<User> = new EventEmitter(null);

  constructor(private http: Http) {

    console.log("Initializing user service");
    if (tokenNotExpired() && localStorage.getItem("loggedInUser") != null) {
      this._loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    }
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


  login(user: string, password: string): Observable<User> {

    var rop = new RequestOptions();
    const params = new URLSearchParams();
    params.append("phoneNumber", user);
    params.append("password", password);
    rop.params = params;

    return this.http.get(this.loginUrl, rop)
      .map(resp => resp.json())
      .map(json => {

        const token = json.data.token;
        const msisdn = json.data.msisdn;
        const userUid = json.data.userUid;
        const displayName = json.data.displayName;
        localStorage.setItem("token", token);


        this._loggedInUser = new User(userUid, displayName, msisdn);
        this.loggedInUser.emit(this._loggedInUser);
        localStorage.setItem("loggedInUser", JSON.stringify(this._loggedInUser));
        return this._loggedInUser;
      })
  }


  logout(): any {
    this._loggedInUser = null;
    this.loggedInUser.emit(this._loggedInUser);
    localStorage.removeItem('token');
  }


  isLoggedIn(): boolean {
    return this._loggedInUser != null;
  }

  getLoggedInUser() {
    return this._loggedInUser;
  }
}
