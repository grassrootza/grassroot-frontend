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
  private updateImageUrl: string = environment.backendAppUrl + "/api/user/profile/image/change";
  private loggedInUserImageUrlBase = environment.backendAppUrl + "/api/user/profile/image/view";

  private _loggedInUser: AuthenticatedUser = null;
  public loggedInUser: EventEmitter<AuthenticatedUser> = new EventEmitter(null);

  public showForceLogoutReason = false;

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
    let params = new HttpParams()
      .set("name", name)
      .set("password", password);

    // this can happen (java - javascript JSON conversion loveliness)
    if (phone && phone != "null") {
      params = params.set("phone", phone);
    }

    if (email && email != "null") {
      params = params.set("email", email);
    }

    return this.httpClient.get<AuthorizationResponse>(this.registerUrl, {params: params})
      .map(authResponse => {
        if (authResponse.errorCode == null) {
          this.storeAuthUser(authResponse.user, authResponse.user.token);
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
      .set('password', password)
      .set("interfaceType", "WEB_2");

    return this.httpClient.get<AuthorizationResponse>(this.loginUrl, {params: params})
      .map(
        authResponse => {
          console.log("AuthResponse: ", authResponse);
          if (authResponse.errorCode == null) {
            this.storeAuthUser(authResponse.user, authResponse.user.token);
          }
          return authResponse;
        }
      );
  }

  storeAuthUser(user: AuthenticatedUser, token?: string) {
    if (token) {
      localStorage.setItem("token", token);
    }
    this._loggedInUser = user;
    this.loggedInUser.emit(this._loggedInUser);
    localStorage.setItem("loggedInUser", JSON.stringify(this._loggedInUser));
  }

  logout(showForceLogoutReason: boolean): any {

    this.showForceLogoutReason = showForceLogoutReason;

    this._loggedInUser = null;
    this.loggedInUser.emit(this._loggedInUser);
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('afterLoginUrl'); // to avoid coming back to same place after logout/login

    // clear up broadcast items, just in case user had some lying around
    localStorage.removeItem('broadcastCreateRequest');
    localStorage.removeItem('broadcastCreateStep');

    console.log("routing to login");
    console.log("going back to login");
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
          this.storeAuthUser(updatedUser, updatedUser.token);
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
      .set("callingInterface", "WEB_2");

    return this.httpClient.post(this.updatePasswordUrl, null, {params: params});
  }

  // use this instead of media service because server method uses user's UID to stash
  // note: keeping image max library out of this service (as this service is needed pre-login)
  // so call image resize in component, not here
  updateImage(image: any): Observable<string> {
    const formData: FormData = new FormData();
    formData.append("photo", image, image.name);
    return this.httpClient.post(this.updateImageUrl, formData, { responseType: 'text'}).map(response => {
      console.log("image response from server: ", response);
      let updatedUser = this._loggedInUser;
      updatedUser.hasImage = true;
      this.storeAuthUser(updatedUser);
      return response;
    });
  }

  getProfileImageUrl(cacheBust: boolean = false) {
    if (!this._loggedInUser || !this._loggedInUser.hasImage) {
      return null;
    }
    // query param is to force reload
    return this.loggedInUserImageUrlBase + "/" + this._loggedInUser.userUid + (cacheBust ? "?cb=" + Date.now() : "");
  }
}
