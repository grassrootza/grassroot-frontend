import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { getAccountEntity, SubscriptionAccount } from './accounts/subscription-account.model';
import { Observable } from 'rxjs/Observable';
import { UserExtraAccount, getEntity } from '../user/account/account.user.model';

@Injectable()
export class AccountsAdminService {

  private listEnabledUserAccountsUrl: string = environment.backendAppUrl + "/api/admin/accounts/list/enabled";
  private listDisabledUserAccountsUrl: string = environment.backendAppUrl + "/api/admin/accounts/list/disabled";
  private accountFetchUrl = environment.backendAppUrl + "/api/account/fetch";

  private updateLastBillingDateUrl: string = environment.backendAppUrl + "/api/admin/accounts/update/billing";
  private updateSubscriptionRefUrl: string = environment.backendAppUrl + "/api/admin/accounts/update/subscription";

  private enableAccountUrl: string = environment.backendAppUrl + "/api/admin/accounts/enable/account";
  private disableAccountUrl: string = environment.backendAppUrl + "/api/admin/accounts/disable/account";

  private listBillingAccountsUrl: string = environment.backendAppUrl + '/api/admin/accounts/list/billing';

  constructor(private httpClient: HttpClient) { }

  public listCurrentAccounts(): Observable<UserExtraAccount[]> {
    return this.httpClient.get<UserExtraAccount[]>(this.listEnabledUserAccountsUrl).map(accounts => accounts.map(getEntity));
  }

  public fetchDisabledAccounts(): Observable<any> {
    return this.httpClient.get(this.listDisabledUserAccountsUrl);
  }

  public fetchDisabledAccount(accountUid: string): Observable<UserExtraAccount> {
    let params = new HttpParams().set('accountUid', accountUid);
    return this.httpClient.get<UserExtraAccount>(this.accountFetchUrl, { params: params}).map(getEntity);
  }

  public updateLastBillingDate(accountUid: string, newLastBillingDateMillis: number): Observable<UserExtraAccount> {
    let params = new HttpParams().set('accountUid', accountUid).set('newLastBillingDateTimeMillis', '' + newLastBillingDateMillis);
    return this.httpClient.post<UserExtraAccount>(this.updateLastBillingDateUrl, null, { params: params}).map(getEntity);
  }

  public updateSubscriptionRef(accountUid: string, newSubscriptionRef: string) {
    let params = new HttpParams().set('accountUid', accountUid).set('newSubscriptionRef', newSubscriptionRef);
    return this.httpClient.post<UserExtraAccount>(this.updateSubscriptionRefUrl, null, { params: params }).map(getEntity);
  }

  public enableAccount(accountUid: string, reasonToRecord: string) {
    let params = new HttpParams().set('accountUid', accountUid).set('logMessage', reasonToRecord);
    return this.httpClient.post<UserExtraAccount>(this.enableAccountUrl, null, {params: params}).map(getEntity);
  }

  public disableAccount(accountUid: string, reasonToRecord: string) {
    let params = new HttpParams().set('accountUid', accountUid).set('logMessage', reasonToRecord);
    return this.httpClient.post<UserExtraAccount>(this.disableAccountUrl, null, {params: params}).map(getEntity);
  }

  public listCurrentSubscriptions(): Observable<SubscriptionAccount[]> {
    return this.httpClient.get<SubscriptionAccount[]>(this.listBillingAccountsUrl).map(accounts => accounts.map(getAccountEntity));
  }

}
