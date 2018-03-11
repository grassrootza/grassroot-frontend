import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import {AuthenticatedUser, AuthorizationResponse, UserProfile} from "./user.model";
import {Router} from "@angular/router";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PhoneNumberUtils} from "../utils/PhoneNumberUtils";
import {isValidNumber} from "libphonenumber-js";
import {Account} from "./model/account.model";
import {AccountType} from "./model/account-type.enum";
import {AccountBillingRecords} from "./model/account-billing-records.model";

@Injectable()
export class AccountService {

  private accountFetchUrl = environment.backendAppUrl + "/api/account/settings/fetch";
  private updateAccountUrl = environment.backendAppUrl + "/api/account/settings/update";
  private getAccountFeesUrl = environment.backendAppUrl + "/api/account/account-fees";
  private getCostSinceLastBillUrl = environment.backendAppUrl + "/api/account/last-cost";
  private getAccountBillingRecordsUrl = environment.backendAppUrl + "/api/account/billing-records";
  private downloadAccountBillingRecordUrl = environment.backendAppUrl + "/api/account/statement";
  private closeAccountUrl = environment.backendAppUrl + "/api/account/close";


  constructor(private httpClient: HttpClient, private router: Router) {
  }

  fetchAccountDetails(): Observable<Account>{
    return this.httpClient.get<Account>(this.accountFetchUrl)
      .map(account => {
        if(account)
          return Account.transformDates(account);
    })
  }

  getAccountFees(): Observable<any> {
    return this.httpClient.get(this.getAccountFeesUrl).map(resp => {
      return resp;
    })
  }

  getCostSinceLastBill(accountUid: string): Observable<any> {
    let params = new HttpParams()
      .set("accountUid", accountUid);

    return this.httpClient.get(this.getCostSinceLastBillUrl, {params: params}).map(resp => {
      return resp;
    })
  }

  getPastPayments(accountUid: string): Observable<AccountBillingRecords[]> {
    let params = new HttpParams()
      .set("accountUid", accountUid);

    return this.httpClient.get<AccountBillingRecords[]>(this.getAccountBillingRecordsUrl, {params: params})
      .map(abrs =>
        abrs.map(
          abr => AccountBillingRecords.transformDates(abr)
        )
      );
  }

  downloadPastInvoice(paymentUid: string, accountUid: string){
    let params = new HttpParams()
      .set("paymentUid", paymentUid)
      .set("accountUid", accountUid);
    return this.httpClient.get(this.downloadAccountBillingRecordUrl, { params: params, responseType: 'blob' });
  }

  closeAccount(accountUid: string): Observable<any> {
    let params = new HttpParams()
      .set("accountUid", accountUid);

    return this.httpClient.post(this.closeAccountUrl, null, {params: params})
      .map(resp => {
        return resp;
      })
  }

  updateAccount(accountUid: string, accountName: string, billingUserEmail: string, type: string, billingCycle: string) {
    let params = new HttpParams()
      .set("accountUid", accountUid)
      .set("accountName", accountName)
      .set("billingEmail", billingUserEmail)
      .set("accountType",type)
      .set("billingCycle", billingCycle);
    return this.httpClient.post(this.updateAccountUrl, null, {params: params})
      .map(result => {
        let message = result['message'];
        console.log("here is the result: ", result);
        return message;
      });
  }
}
