import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable()
export class AccountService {

  public MONTHLY_SUBSCRIPTION_FEE = 30000; // R300 in cents

  private createAccountUrl = environment.backendAppUrl + "/api/account/create";

  private accountFetchUrl = environment.backendAppUrl + "/api/account/settings/fetch";
  private updateAccountUrl = environment.backendAppUrl + "/api/account/settings/update";
  private getCostSinceLastBillUrl = environment.backendAppUrl + "/api/account/last-cost";
  private closeAccountUrl = environment.backendAppUrl + "/api/account/close";

  private updatePaymentRefUrl = environment.backendAppUrl + "/api/account/change/payment";

  constructor(private httpClient: HttpClient) {
  }

  // gets a checkout ID for first month's subscription fee
  initiateCCardPayment(): Observable<string> {
    let params = new HttpParams().set('amountZAR', '' + this.MONTHLY_SUBSCRIPTION_FEE);
    return this.httpClient.get('payment', { params: params, responseType: 'text' });
  }

  updatePaymentRef(accountId: string, paymentRef: string, addAllGroupsToAccount?: boolean) {
    const fullUrl = this.updatePaymentRefUrl + "/" + accountId;
    let params = new HttpParams().set('paymentRef', paymentRef);
    if (addAllGroupsToAccount)
      params = params.set('addAllGroups', '' + addAllGroupsToAccount);
    return this.httpClient.post(fullUrl, null, {params: params});
  }

  createAccount(accountName: string, billingEmail: string, addAllGroupsToAccount: boolean = true, 
      otherAdmins?: string[], existingAccountId?: string, ) {
    let params = new HttpParams().set('accountName', accountName).set('billingEmail', billingEmail)
      .set('addAllGroupsToAccount', '' + addAllGroupsToAccount);
    
    if (existingAccountId) {
      params = params.set('existingAccountId', existingAccountId);
    }

    if (otherAdmins) {
      params = params.set('otherAdmins', otherAdmins.join(','));
    }

    return this.httpClient.post(this.createAccountUrl, null, { params: params });
  }

  fetchAccountDetails() {
    return this.httpClient.get(this.accountFetchUrl);
  }
  
  getCostSinceLastBill(accountUid: string): Observable<any> {
    let params = new HttpParams()
      .set("accountUid", accountUid);

    return this.httpClient.get(this.getCostSinceLastBillUrl, {params: params}).map(resp => {
      return resp;
    })
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
      .set("billingEmail", billingUserEmail);
    return this.httpClient.post(this.updateAccountUrl, null, {params: params})
      .map(result => {
        let message = result['message'];
        console.log("here is the result: ", result);
        return message;
      });
  }
}
