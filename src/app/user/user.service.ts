import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import {AuthenticatedUser, AuthorizationResponse, UserProfile} from "./user.model";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PhoneNumberUtils} from "../utils/PhoneNumberUtils";
import {isValidNumber} from "libphonenumber-js";

@Injectable()
export class UserService {

  private registerUrl = environment.backendAppUrl + "/api/auth/web/register";
  private loginUrl: string = environment.backendAppUrl + "/api/auth/login-password";
  private updateProfileUrl: string = environment.backendAppUrl + "/api/user/profile/data/update";
  private updatePasswordUrl: string = environment.backendAppUrl + "/api/user/profile/password/update";

  private _loggedInUser: AuthenticatedUser = null;
  public loggedInUser: EventEmitter<AuthenticatedUser> = new EventEmitter(null);

  constructor(private httpClient: HttpClient, private router: Router) {
    console.log("Initializing user service");
    if (localStorage.getItem("loggedInUser") != null) {
      this._loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    }
  }

  register(name: string, phone: string, email: string, password: string): Observable<AuthorizationResponse> {
    if (isValidNumber(phone, "ZA")) {
      phone = PhoneNumberUtils.convertToSystem(phone);
    }
    const params = new HttpParams()
      .set("name", name)
      .set("phone", phone)
      .set("email", email)
      .set("password", password);
    return this.httpClient.get<AuthorizationResponse>(this.registerUrl, {params: params})
      .map(authResponse => {
        if (authResponse.errorCode == null) {
          this.storeAuthUser(authResponse.user.token, authResponse.user);
        }
        return authResponse;
      });
  }

  login(user: string, password: string): Observable<AuthorizationResponse> {

    if (isValidNumber(user, "ZA")) {
      user = PhoneNumberUtils.convertToSystem(user);
    }

    console.log("submitting username: ", user);
    let params = new HttpParams()
      .set('username', user)
      .set('password', password);

    return this.httpClient.get<AuthorizationResponse>(this.loginUrl, {params: params})
      .map(
        authResponse => {
          console.log("AuthResponse: ", authResponse);
          if (authResponse.errorCode == null) {
            this.storeAuthUser(authResponse.user.token, authResponse.user);
          }
          return authResponse;
        }
      );
  }

  storeAuthUser(token: string, user: AuthenticatedUser) {
    localStorage.setItem("token", token);
    this._loggedInUser = user;
    this.loggedInUser.emit(this._loggedInUser);
    localStorage.setItem("loggedInUser", JSON.stringify(this._loggedInUser));
  }

  logout(): any {
    this._loggedInUser = null;
    this.loggedInUser.emit(this._loggedInUser);
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('afterLoginUrl'); // to avoid coming back to same place after logout/login

    // clear up broadcast items, just in case user had some lying around
    localStorage.removeItem('broadcastCreateRequest');
    localStorage.removeItem('broadcastCreateStep');

    console.log("routing to login");
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this._loggedInUser != null;
  }

  getLoggedInUser(): AuthenticatedUser {
    return this._loggedInUser;
  }

  updateDetails(user: UserProfile, otp?: string) {
    let msisdn = (user.phone) ? PhoneNumberUtils.convertToSystem(user.phone) : "";
    let params = new HttpParams()
      .set("name", user.name).set("phone", msisdn).set("email", user.email).set("province", user.province)
      .set("language", user.language);
    if (otp) {
      params = params.set("validationOtp", otp);
    }
    return this.httpClient.post(this.updateProfileUrl, null, {params: params})
      .map(result => {
        let message = result['message'];
        console.log("here is the result: ", message);
        if (message == "UPDATED") {
          let updatedUser: AuthenticatedUser = result['data'];
          // console.log("updating the user, which is: ", updatedUser);
          this.storeAuthUser(updatedUser.token, updatedUser);
        }
        return message;
      });
  }

  updatePassword(oldPwd: string, newPwd: string, confirmPwd: string) {
    console.log("calling update password");

    let params = new HttpParams()
      .set("oldPassword", oldPwd)
      .set("newPassword", newPwd)
      .set("confirmNewPwd", confirmPwd)
      .set("callingInterface", "ANGULAR");

    return this.httpClient.post(this.updatePasswordUrl, null, {params: params});
  }
}
