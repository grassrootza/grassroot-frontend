import { Component, OnInit } from '@angular/core';
import { AccountsAdminService } from '../admin-accounts.service';
import { AlertService } from '../../utils/alert-service/alert.service';
import { UserExtraAccount } from '../../user/account/account.user.model';

declare var $: any;

@Component({
  selector: 'app-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.css']
})
export class AdminAccountsComponent implements OnInit {

  public accounts: UserExtraAccount[];
  
  public disabledMap: any;
  public disabledUids: string[];
  public disabledAccountToView: UserExtraAccount;

  constructor(private accountsService: AccountsAdminService, private alertService: AlertService) { }

  ngOnInit() {
    this.fetchEnabledAccounts();

    this.accountsService.fetchDisabledAccounts().subscribe(disabledMap => {
      this.disabledMap = disabledMap;
      this.disabledUids = Object.keys(disabledMap);
    });
  }

  fetchEnabledAccounts() {
    this.alertService.showLoading();
    this.accountsService.listCurrentAccounts().subscribe(accounts => {
      console.log('accounts: ', accounts);
      this.accounts = accounts;
      this.alertService.hideLoadingDelayed();
    }, error => {
      console.log('error fetching accounts: ', error);
    })
  }

  enableDisabledAccount(accountUid: string) {
    this.accountsService.enableAccount(accountUid, 'Enabled by System Admin via console').subscribe(_ => {
      this.fetchEnabledAccounts();
    })
    return false;
  }

  viewDisabledAccount(accountUid: string) {
    this.accountsService.fetchDisabledAccount(accountUid).subscribe(account => {
      this.disabledAccountToView = account;
      $('#disabled-account-modal').modal('show');
    });
    return false;
  }

}
