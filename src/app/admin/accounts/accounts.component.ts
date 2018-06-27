import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../accounts.service';
import { SubscriptionAccount } from './account.model';
import { AlertService } from '../../utils/alert-service/alert.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  public accounts: SubscriptionAccount[];
  public viewingAccount: SubscriptionAccount;

  constructor(private accountsService: AccountsService, private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.showLoading();
    this.accountsService.listCurrentAccounts().subscribe(accounts => {
      console.log('accounts: ', accounts);
      this.accounts = accounts;
      this.alertService.hideLoadingDelayed();
    }, error => {
      console.log('error fetching accounts: ', error);
    })
  }

  viewAccountDetails(account: SubscriptionAccount) {
    this.viewingAccount = account;
  }

}
