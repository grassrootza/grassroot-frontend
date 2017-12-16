import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import {AuthorizationResponse, User} from "./user.model";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class UserService {

  private registerUrl = environment.backendAppUrl + "/api/auth/web/register";
  private loginUrl: string = environment.backendAppUrl + "/api/auth/login-password";

  private _loggedInUser: User = null;
  public loggedInUser: EventEmitter<User> = new EventEmitter(null);

  constructor(private httpClient: HttpClient, private router: Router) {

    console.log("Initializing user service");
    if (localStorage.getItem("loggedInUser") != null) {
      this._loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    }
  }

  register(username: string, phoneNumber: string, password: string): Observable<AuthorizationResponse> {

    const params = new HttpParams();
    params.append("username", username);
    params.append("phoneNumber", phoneNumber);
    params.append("password", password);
    return this.httpClient.get<AuthorizationResponse>(this.registerUrl, {params: params});
  }


  login(user: string, password: string): Observable<AuthorizationResponse> {

    let params = new HttpParams()
      .set('phoneNumber', user)
      .set('password', password);

    return this.httpClient.get<AuthorizationResponse>(this.loginUrl, {params: params})
      .map(
        authResponse => {
          console.log("AuthResponse: ", authResponse);
          if (authResponse.errorCode == null) {

            const token = authResponse.user.token;
            localStorage.setItem("token", token);
            this._loggedInUser = authResponse.user;
            this.loggedInUser.emit(this._loggedInUser);
            localStorage.setItem("loggedInUser", JSON.stringify(this._loggedInUser));
          }
          return authResponse;
        }
      );
  }


  logout(): any {
    this._loggedInUser = null;
    this.loggedInUser.emit(this._loggedInUser);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }


  isLoggedIn(): boolean {
    return this._loggedInUser != null;
  }

  getLoggedInUser() {
    return this._loggedInUser;
  }
}
