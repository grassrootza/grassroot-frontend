import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "environments/environment";
import {AuthenticatedUser, AuthorizationResponse, getAuthUser, UserProfile} from "./user.model";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PhoneNumberUtils} from "../utils/PhoneNumberUtils";
import {isValidNumber} from "libphonenumber-js";
import {LocalStorageService} from "../utils/local-storage.service";
import {CookiesService} from "../utils/cookie-service/cookies.service";
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {

  private registerUrl = environment.backendAppUrl + "/api/auth/web/register";
  private loginUrl: string = environment.backendAppUrl + "/api/auth/login-password";
  private updateProfileUrl: string = environment.backendAppUrl + "/api/user/profile/data/update";
  private updatePasswordUrl: string = environment.backendAppUrl + "/api/user/profile/password/update";
  private updateImageUrl: string = environment.backendAppUrl + "/api/user/profile/image/change";
  private loggedInUserImageUrlBase = environment.backendAppUrl + "/api/image/user";
  private fetchApiTokenUrl: string = environment.backendAppUrl + "/api/user/profile/token/obtain";

  private deleteUserInitiate: string = environment.backendAppUrl + "/api/user/profile/delete/initiate";
  private deleteUserConfirm: string = environment.backendAppUrl + "/api/user/profile/delete/confirm";
  private setUserLocationUrl = environment.backendAppUrl + "/api/user/profile/user/location";

  private _loggedInUser: AuthenticatedUser = null;
  public loggedInUser: EventEmitter<AuthenticatedUser> = new EventEmitter(null);

  public showForceLogoutReason = false;

  constructor(private httpClient: HttpClient, private router: Router, private localStorageService: LocalStorageService,
              private cookieService: CookiesService) {
    console.log("Initializing user service");
    if (this.localStorageService.getItem("loggedInUser")) {
      this._loggedInUser = getAuthUser(JSON.parse(this.localStorageService.getItem("loggedInUser")))
    }
  }

  register(name: string, phone: string, email: string, password: string,otpEntered:string): Observable<AuthorizationResponse> {
    if (isValidNumber(phone, "ZA")) {
      phone = PhoneNumberUtils.convertToSystem(phone);
    }
    let params = new HttpParams()
      .set("name", name)
      .set("password", password)
      .set("interfaceType", "WEB_2")
      .set('otpEntered',otpEntered);
    

    // this can happen (java - javascript JSON conversion loveliness)
    if (phone && phone != "null") {
      params = params.set("phone", phone);
    }

    if (email && email != "null") {
      params = params.set("email", email);
    }

    return this.httpClient.post<AuthorizationResponse>(this.registerUrl, null, {params: params})
      .pipe(map(authResponse => {
        if (authResponse.errorCode == null) {
          this.storeAuthUser(getAuthUser(authResponse.user), authResponse.user.token);
        }
        return authResponse;
      }));
  }

  login(user: string, password: string): Observable<AuthorizationResponse> {
    if (isValidNumber(user, 'ZA')) {
      user = PhoneNumberUtils.convertToSystem(user);
    }

    console.log('submitting username: ', user);
    let params = new HttpParams()
      .set('username', user)
      .set('password', password)
      .set("interfaceType", "WEB_2");

    return this.httpClient.post<AuthorizationResponse>(this.loginUrl, null, {params: params})
      .pipe(map(authResponse => {
          console.log("AuthResponse: ", authResponse);
          if (authResponse.errorCode == null) {
            this.storeAuthUser(getAuthUser(authResponse.user), authResponse.user.token);
          }
          return authResponse;
        }
      ));
  }

  storeAuthUser(user: AuthenticatedUser, token?: string) {
    if (token) {
      this.localStorageService.setItem('token', token);
    }
    
    this._loggedInUser = user;
    this.loggedInUser.emit(this._loggedInUser);
    this.localStorageService.setItem("loggedInUser", JSON.stringify(this._loggedInUser));
    this.cookieService.storeUserLoggedIn();
  }

  logout(showForceLogoutReason: boolean, afterLogoutRoute: string = ''): any {
    this.showForceLogoutReason = showForceLogoutReason;
    this.cleanUpUser();
    this.router.navigate([afterLogoutRoute]);
  }

  cleanUpUser() {
    this._loggedInUser = null;
    this.loggedInUser.emit(this._loggedInUser);
    this.localStorageService.removeItem('token');
    this.localStorageService.removeItem('loggedInUser');
    this.localStorageService.removeItem('afterLoginUrl'); // to avoid coming back to same place after logout/login

    // clear up broadcast items, just in case user had some lying around
    this.localStorageService.removeItem('broadcastCreateRequest');
    this.localStorageService.removeItem('broadcastCreateStep');

    this.localStorageService.clearCaches();

    this.cookieService.clearUserLoggedIn();
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
      .set("name", user.name)
      .set("phone", msisdn)
      .set("email", user.email)
      .set("province", user.province)
      .set("language", user.language)
      .set('whatsappOptIn',user.whatsAppOptedIn + "");
    if (otp) {
      params = params.set("validationOtp", otp);
    }
    return this.httpClient.post(this.updateProfileUrl, null, {params: params})
      .pipe(map(result => {
        let message = result['message'];
        //console.log("here is the result: ", message);
        if (message == "UPDATED") {
          let updatedUser: AuthenticatedUser = getAuthUser(result['data']);
          this.storeAuthUser(updatedUser, updatedUser.token);
        }
        return message;
      }));
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
    return this.httpClient.post(this.updateImageUrl, formData, { responseType: 'text'}).pipe(map(response => {
      console.log("image response from server: ", response);
      let updatedUser = this._loggedInUser;
      updatedUser.hasImage = true;
      this.storeAuthUser(updatedUser);
      return response;
    }));
  }

  getProfileImageUrl(cacheBust: boolean = false) {
    if (!this._loggedInUser || !this._loggedInUser.hasImage) {
      return null;
    }
    // query param is to force reload, replacing of v2 is because this is non-api
    let imageUrl = this.loggedInUserImageUrlBase + "/" + this._loggedInUser.userUid + (cacheBust ? "?cb=" + Date.now() : "");
    console.log('image url: ', imageUrl);
    return imageUrl;
  }

  hasActivePaidAccount() {
    return this._loggedInUser && this._loggedInUser.hasAccount;
  }

  hasDisabledAccount() {
    return this._loggedInUser && this._loggedInUser.hasAccountAdmin() && !this._loggedInUser.hasAccount; // ie user has role but not enabled
  }

  initiateUserDelete(): Observable<string> {
    return this.httpClient.post(this.deleteUserInitiate, null, { responseType: 'text' });
  }

  completeUserDelete(otp: string): Observable<any> {
    const params = new HttpParams().set("otp", otp);
    return this.httpClient.post(this.deleteUserConfirm, null, { params: params, responseType: 'text' }).pipe(map(result => {
      console.log("result from server: ", result);
      if (result == 'USER_DELETED') {
        console.log("okay, cleaning up user");
        this.cleanUpUser();
      }
      return result;
    }));
  }

  fetchAccessToken(): Observable<string> {
    return this.httpClient.get(this.fetchApiTokenUrl, { responseType: 'text' });
  }

  setUserLocation(latitude:any,longitude:any): Observable<any>{
    let params = new HttpParams()
      .set("lat",latitude)
      .set("lon",longitude);

    
    return this.httpClient.post(this.setUserLocationUrl,null,{params:params, responseType: 'text'});
  }
}
