import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { getAccountEntity, SubscriptionAccount } from './accounts/subscription-account.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserExtraAccount, getEntity } from '../user/account/account.user.model';

@Injectable()
export class AccountsAdminService {

  private listEnabledUserAccountsUrl: string = environment.backendAppUrl + "/api/admin/accounts/list/enabled";
  private listDisabledUserAccountsUrl: string = environment.backendAppUrl + "/api/admin/accounts/list/disabled";
  private accountFetchUrl = environment.backendAppUrl + "/api/account/fetch";

  private updateLastBillingDateUrl: string = environment.backendAppUrl + "/api/admin/accounts/update/billing";
  private updateSubscriptionRefUrl: string = environment.backendAppUrl + "/api/admin/accounts/update/subscription";
  private updateDatasetRefUrl: string = environment.backendAppUrl + '/api/admin/accounts/update/datasets';

  private enableAccountUrl: string = environment.backendAppUrl + "/api/admin/accounts/enable/account";
  private disableAccountUrl: string = environment.backendAppUrl + "/api/admin/accounts/disable/account";
  private closeAccountUrl: string = environment.backendAppUrl + "/api/admin/accounts/close/account";

  private listBillingAccountsUrl: string = environment.backendAppUrl + '/api/admin/accounts/list/billing';

  constructor(private httpClient: HttpClient) { }

  public listCurrentAccounts(): Observable<UserExtraAccount[]> {
    return this.httpClient.get<UserExtraAccount[]>(this.listEnabledUserAccountsUrl).pipe(map(accounts => accounts.map(getEntity)));
  }

  public fetchDisabledAccounts(): Observable<any> {
    return this.httpClient.get(this.listDisabledUserAccountsUrl);
  }

  public fetchDisabledAccount(accountUid: string): Observable<UserExtraAccount> {
    let params = new HttpParams().set('accountUid', accountUid);
    return this.httpClient.get<UserExtraAccount>(this.accountFetchUrl, { params: params}).pipe(map(getEntity));
  }

  public updateLastBillingDate(accountUid: string, newLastBillingDateMillis: number): Observable<UserExtraAccount> {
    let params = new HttpParams().set('accountUid', accountUid).set('newLastBillingDateTimeMillis', '' + newLastBillingDateMillis);
    return this.httpClient.post<UserExtraAccount>(this.updateLastBillingDateUrl, null, { params: params}).pipe(map(getEntity));
  }

  public updateSubscriptionRef(accountUid: string, newSubscriptionRef: string) {
    let params = new HttpParams().set('accountUid', accountUid).set('newSubscriptionRef', newSubscriptionRef);
    return this.httpClient.post<UserExtraAccount>(this.updateSubscriptionRefUrl, null, { params: params }).pipe(map(getEntity));
  }

  public enableAccount(accountUid: string, reasonToRecord: string) {
    let params = new HttpParams().set('accountUid', accountUid).set('logMessage', reasonToRecord);
    return this.httpClient.post<UserExtraAccount>(this.enableAccountUrl, null, {params: params}).pipe(map(getEntity));
  }

  public disableAccount(accountUid: string, reasonToRecord: string) {
    let params = new HttpParams().set('accountUid', accountUid).set('logMessage', reasonToRecord);
    return this.httpClient.post<UserExtraAccount>(this.disableAccountUrl, null, {params: params}).pipe(map(getEntity));
  }

  public closeAccount(accountUid: string, reasonToRecord: string) {
    let params = new HttpParams().set('accountUid', accountUid).set('logMessage', reasonToRecord);
    return this.httpClient.post(this.closeAccountUrl, null, { params: params, responseType: 'text'});
  }

  public listCurrentSubscriptions(): Observable<SubscriptionAccount[]> {
    return this.httpClient.get<SubscriptionAccount[]>(this.listBillingAccountsUrl).pipe(map(accounts => accounts.map(getAccountEntity)));
  }

  public updateAccountDatasets(accountUid: string, dataSetLabels: string, updateRefs: boolean) {
    let params = new HttpParams().set('accountUid', accountUid)
      .set('geoDataSets', dataSetLabels)
      .set('updateDynamoReference', '' + updateRefs);
    return this.httpClient.post<UserExtraAccount>(this.updateDatasetRefUrl, null, { params: params }).pipe(map(getEntity));
  }

}
