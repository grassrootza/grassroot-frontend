import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { getAccountEntity, SubscriptionAccount } from './accounts/account.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccountsService {

  private listAccountsUrl: string = environment.backendAppUrl + '/api/admin/accounts/list';

  constructor(private httpClient: HttpClient) { }

  public listCurrentAccounts(): Observable<SubscriptionAccount[]> {
    return this.httpClient.get<SubscriptionAccount[]>(this.listAccountsUrl).map(accounts => accounts.map(getAccountEntity));
  }

}
