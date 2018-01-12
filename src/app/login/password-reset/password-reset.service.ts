import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import {isValidNumber} from "libphonenumber-js";
import {PhoneNumberUtils} from "../../utils/PhoneNumberUtils";

@Injectable()
export class PasswordResetService {

  private initiateUrl = environment.backendAppUrl + "/api/auth/reset-password-request";
  private validateUrl = environment.backendAppUrl + "/api/auth/reset-password-validate";
  private resetUrl = environment.backendAppUrl + "/api/auth/reset-password-complete";

  private username: string;
  private otp: string;

  constructor(private httpClient: HttpClient) { }

  initiateReset(emailOrPhone: string): Observable<any> {
    this.username = PhoneNumberUtils.convertIfPhone(emailOrPhone);
    let params = new HttpParams().set("username", this.username);
    return this.httpClient.post(this.initiateUrl, null , { params: params });
  }

  validateOtp(otp: string): Observable<any> {
    this.otp = otp;
    let params = new HttpParams()
      .set("username", this.username)
      .set("otp", otp);
    return this.httpClient.post(this.validateUrl, null, { params: params });
  }

  completeReset(newPwd: string): Observable<boolean> {
    let params = new HttpParams()
      .set("username", this.username)
      .set("otp", this.otp)
      .set("password", newPwd);

    return this.httpClient.post(this.resetUrl, null, { params: params }).map(result => {
      return true;
    }, error => {
      console.log("error! should return something ...");
      return false;
    });
  }

}
