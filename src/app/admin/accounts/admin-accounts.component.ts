import { Component, OnInit } from '@angular/core';
import { AccountsAdminService } from '../admin-accounts.service';
import { SubscriptionAccount } from './subscription-account.model';
import { AlertService } from '../../utils/alert-service/alert.service';
import { UserExtraAccount } from '../../user/account/account.user.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.css']
})
export class AdminAccountsComponent implements OnInit {

  public accounts: UserExtraAccount[];
  public viewingAccount: UserExtraAccount;

  constructor(private accountsService: AccountsAdminService, private alertService: AlertService) { }

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

}
