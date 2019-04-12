import { Component, OnInit } from '@angular/core';
import { AccountsAdminService } from '../admin-accounts.service';
import { AlertService } from '../../utils/alert-service/alert.service';
import { UserExtraAccount } from '../../user/account/account.user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateTimeUtils } from '../../utils/DateTimeUtils';

declare var $: any;

@Component({
  selector: 'app-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.css']
})
export class AdminAccountsComponent implements OnInit {

  public accounts: UserExtraAccount[];
  
  public accountDateToChange: UserExtraAccount;
  public accountDateChangeForm: FormGroup;

  public accountCostsToChange: UserExtraAccount;
  public accountCostsChangeForm: FormGroup;

  public accountDataSetsToChange: UserExtraAccount;
  public accountDataSetChangeForm: FormGroup;
  
  public disabledMap: any;
  public disabledUids: string[];
  public disabledAccountToView: UserExtraAccount;

  constructor(private accountsService: AccountsAdminService, private alertService: AlertService, private fb: FormBuilder) { }

  ngOnInit() {
    this.fetchEnabledAccounts();
    this.fetchDisabledAccounts();

    this.accountDateChangeForm = this.fb.group({
      'date': [DateTimeUtils.dateFromDate(new Date()), Validators.required],
      'time': [DateTimeUtils.timeFromDate(new Date()), Validators.required],
    });

    this.accountCostsChangeForm = this.fb.group({
      'costPerMessage': [''],
      'costPerUSSD': [''],
      'monthlyCost': ['']
    });

    this.accountDataSetChangeForm = this.fb.group({
      'datasets': [''],
      'updateRefTable': ['false']
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

  fetchDisabledAccounts() {
    this.accountsService.fetchDisabledAccounts().subscribe(disabledMap => {
      this.disabledMap = disabledMap;
      this.disabledUids = Object.keys(disabledMap);
    });
  }

  enableDisabledAccount(accountUid: string) {
    this.accountsService.enableAccount(accountUid, 'Enabled by System Admin via console').subscribe(_ => {
      this.fetchEnabledAccounts();
    })
    return false;
  }

  initiateDateChange(account: UserExtraAccount) {
    this.accountDateToChange = account;
    $('#change-billing-date-account-modal').modal('show');
  }
  
  completeDateChange() {
    let dateMillis: number = DateTimeUtils.momentFromNgbStruct(this.accountDateChangeForm.get('date').value, this.accountDateChangeForm.get('time').value).valueOf();
    this.accountsService.updateLastBillingDate(this.accountDateToChange.uid, dateMillis).subscribe(account => {
      this.accountDateToChange = account;
      let index = this.accounts.findIndex(acc => acc.uid == account.uid);
      this.accounts[index] = account;
      $('#change-billing-date-account-modal').modal('hide');
    }, error => {
      console.log('that failed, error: ', error);
      $('#change-billing-date-account-modal').modal('hide');
    })
  }

  initiateDataSetChange(account: UserExtraAccount) {
    this.accountDataSetsToChange = account;
    setTimeout(() => $('#change-datasets-modal').modal('show'), 300);
  }

  completeDataSetChange() {
    let updateDD = !!this.accountDataSetChangeForm.get('updateRefTable').value;
    console.log('update DD table: ', updateDD);
    this.accountsService.updateAccountDatasets(this.accountDataSetsToChange.uid, this.accountDataSetChangeForm.get('datasets').value, updateDD).subscribe(account => {
      this.accountDataSetsToChange = account;
      let index = this.accounts.findIndex(acc => acc.uid == account.uid);
      this.accounts[index] = account;
      $('#change-datasets-modal').modal('hide');
    }, error => {
      console.log('that failed, error: ', error);
      $('#change-datasets-modal').modal('hide');
    })
  }

  initiateCostChange(account: UserExtraAccount) {
    this.accountCostsToChange = account;
    this.accountCostsChangeForm.setValue({ 'costPerMessage': account.costPerMessage, 'costPerUSSD': account.costPerUssdSession, 'monthlyCost': 0 });
    setTimeout(() => $('#change-account-costs-modal').modal('show'), 300);
  }

  completeCostsChange() {
    let changedParams = { }
    console.log("Form keys: ", Object.keys(this.accountCostsChangeForm.controls));
    Object.keys(this.accountCostsChangeForm.controls)
      .filter(control => this.accountCostsChangeForm.get(control).dirty)
      .forEach(control => changedParams[control] = this.accountCostsChangeForm.get(control).value);
    
    console.log('Changed cost values: ', changedParams);

    if (!changedParams) {
      console.log('Nothing changed!');
      $('#change-account-costs-modal').modal('hide')
      this.alertService.alert('Nothing changed!')
    } else {
      this.accountsService.updateAccountCosts(this.accountCostsToChange.uid, changedParams).subscribe(account => {
        this.accountCostsToChange = account;
        let index = this.accounts.findIndex(acc => acc.uid == account.uid);
        this.accounts[index] = account;
        $('#change-account-costs-modal').modal('hide')
        this.alertService.alert('Updated unit costs!');
      })
    }

  }

  viewDisabledAccount(accountUid: string) {
    this.accountsService.fetchDisabledAccount(accountUid).subscribe(account => {
      this.disabledAccountToView = account;
      $('#disabled-account-modal').modal('show');
    });
    return false;
  }

  closeAccount(accountUid: string) {
    console.log('Closing account with UID: ', accountUid);
    this.accountsService.closeAccount(accountUid, 'Closed by System Admin via console').subscribe(_ => {
      this.fetchDisabledAccounts();
    }, error => {
      console.log('error closing account: ', error);
    })
    return false;
  }

}
