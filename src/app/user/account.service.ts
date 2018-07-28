import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import { UserExtraAccount, getEntity } from './account/account.user.model';
import { AccountSignupResponse } from './account/signup/signup.response.model';
import { DataSetCounts, getCountsEntity } from './account/dataset.count.model';

@Injectable()
export class AccountService {

  public MONTHLY_SUBSCRIPTION_FEE = 30000; // R300 in cents

  private createAccountUrl = environment.backendAppUrl + "/api/account/create";

  private accountFetchUrl = environment.backendAppUrl + "/api/account/fetch";
  private updateAccountUrl = environment.backendAppUrl + "/api/account/settings/update";
  private getGroupNotificationsSinceLastBillUrl = environment.backendAppUrl + "/api/account/fetch/group/notification_count";
  private getCostSinceLastBillUrl = environment.backendAppUrl + "/api/account/last-cost";
  private closeAccountUrl = environment.backendAppUrl + "/api/account/close";

  private updatePaymentRefUrl = environment.backendAppUrl + "/api/account/change/payment";
  
  private setAccountPrimaryUrl = environment.backendAppUrl + "/api/account/primary/set";
  private removeAccountAdminUrl = environment.backendAppUrl + "/api/account/remove/admin";
  private addAccountAdminUrl = environment.backendAppUrl + "/api/account/add/admin";
  
  private addGroupUrl = environment.backendAppUrl + "/api/account/add/group";
  private removeGroupUrl = environment.backendAppUrl + "/api/account/remove/group";
  private fetchCandidateGroupsUrl = environment.backendAppUrl + "/api/account/fetch/groups/candidates";

  private fetchAllDataSetDetailsUrl = environment.backendAppUrl + "/api/account/fetch/all/dataset";
  private fetchDataSetCountsUrl = environment.backendAppUrl + "/api/account/fetch/dataset";

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

  createAccount(accountName: string, billingEmail: string, addAllGroupsToAccount: boolean = true, otherAdmins?: string[]) {
    let params = new HttpParams()
      .set('accountName', accountName)
      .set('billingEmail', billingEmail)
      .set('addAllGroupsToAccount', '' + addAllGroupsToAccount);
    
    if (otherAdmins) {
      params = params.set('otherAdmins', otherAdmins.join(','));
    }

    return this.httpClient.post<AccountSignupResponse>(this.createAccountUrl, null, { params: params });
  }

  fetchAccountDetails(accountUid?: string): Observable<UserExtraAccount> {
    if (accountUid) {
      let params = new HttpParams().set('accountUid', accountUid);
      return this.httpClient.get<UserExtraAccount>(this.accountFetchUrl, { params: params}).map(getEntity);
    } else {
      return this.httpClient.get<UserExtraAccount>(this.accountFetchUrl).map(getEntity);
    }
  }

  getGroupNotifications(accountUid: string, groupUid: string): Observable<number> {
    let params = new HttpParams().set('accountUid', accountUid).set('groupUid', groupUid);
    return this.httpClient.get(this.getGroupNotificationsSinceLastBillUrl, { params: params, responseType: 'text'}).map(response => {
      console.log('response from server: ', response);
      return parseInt(response);
    })
  }
  
  getCostSinceLastBill(accountUid: string): Observable<any> {
    let params = new HttpParams()
      .set("accountUid", accountUid);

    return this.httpClient.get(this.getCostSinceLastBillUrl, {params: params}).map(resp => {
      return resp;
    })
  }

  getDetailsOfDataSets(accountUid?: string): Observable<DataSetCounts[]> {
    let params = new HttpParams();
    if (accountUid)
      params = params.set('accountUid', accountUid);

    console.log('fetching datasets for account uid: ', accountUid);
    return this.httpClient.get<DataSetCounts[]>(this.fetchAllDataSetDetailsUrl, {params: params})
      .map(results => results.map(getCountsEntity));
  }

  getDataSetCounts(datasetLabel: string, accountUid?: string) {
    let fullUrl = this.fetchDataSetCountsUrl + "/" + datasetLabel;
    let params = new HttpParams();
    if (accountUid)
      params = params.set('accountUid', accountUid);
    
    return this.httpClient.get<DataSetCounts>(fullUrl, { params: params }).map(getCountsEntity);
  }

  closeAccount(accountUid: string): Observable<any> {
    let params = new HttpParams()
      .set("accountUid", accountUid);

    return this.httpClient.post(this.closeAccountUrl, null, {params: params, responseType: 'text'});
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

  makeAccountPrimary(accountUid: string): Observable<UserExtraAccount> {
    const fullUrl = this.setAccountPrimaryUrl + "/" + accountUid;
    return this.httpClient.post<UserExtraAccount>(fullUrl, null).map(getEntity);
  }

  addGroups(accountUid: string, groupUids: string[]): Observable<UserExtraAccount> {
    const fullUrl = this.addGroupUrl + "/" + accountUid;
    let params = new HttpParams().set('groupUids', groupUids.join(','));
    return this.httpClient.post<UserExtraAccount>(fullUrl, null, { params: params }).map(getEntity);
  }

  addAllGroups(accountUid: string): Observable<UserExtraAccount> {
    const fullUrl = this.addGroupUrl + "/" + accountUid + "/all";;
    return this.httpClient.post<UserExtraAccount>(fullUrl, null).map(getEntity);
  }

  fetchGroupsThatCanAddToAccount(accountUid: string): Observable<any> {
    let params = new HttpParams().set('accountUid', accountUid);
    return this.httpClient.get(this.fetchCandidateGroupsUrl, { params: params });    
  }

  removeGroup(accountUid: string, groupUid: string) {
    const fullUrl = this.removeGroupUrl + "/" + accountUid;
    let params = new HttpParams().set('groupIds', groupUid);
    return this.httpClient.post<UserExtraAccount>(fullUrl, null, { params: params }).map(getEntity);
  }

  addAdmin(accountUid: string, phoneOrEmail: string): Observable<string[]> {
    const fullUrl = this.addAccountAdminUrl + "/" + accountUid;
    let params = new HttpParams().set('userToAddPhoneOrEmail', phoneOrEmail);
    console.log('adding admin: ', params);
    return this.httpClient.post<string[]>(fullUrl, null, {params: params});
  }

  removeAdmin(accountUid: string, adminUid: string): Observable<UserExtraAccount> {
    const fullUrl = this.removeAccountAdminUrl + "/" + accountUid;
    let params = new HttpParams().set('adminUid', adminUid);
    return this.httpClient.post<UserExtraAccount>(fullUrl, null, {params: params}).map(getEntity);
  }
}
