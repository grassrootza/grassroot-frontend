import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable()
export class AccountsService {

  private listAccountsUrl: string = environment.backendAppUrl + '/api/admin/accounts/list';

  constructor(private httpClient: HttpClient) { }

  public listCurrentAccounts() {
    return this.httpClient.get(this.listAccountsUrl);
  }

}
