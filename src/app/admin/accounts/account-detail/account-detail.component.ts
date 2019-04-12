import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AccountsAdminService } from '../../admin-accounts.service';
import { UserExtraAccount } from '../../../user/account/account.user.model';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {

  @Input() public account: UserExtraAccount;
  @Output() public onChangeBillingDateClicked: EventEmitter<UserExtraAccount> = new EventEmitter();
  @Output() public onChangeDatasetsClicked: EventEmitter<UserExtraAccount> = new EventEmitter();
  @Output() public onChangeAccountCostsClicked: EventEmitter<UserExtraAccount> = new EventEmitter();

  public viewDetails: boolean = false;
  public numberGroups: number;
  public accountAdmins: string;

  constructor(private accountsService: AccountsAdminService) { }

  ngOnInit() {
  }

  public toggleAccountDetails() {
    this.numberGroups = Object.keys(this.account.paidForGroups).length;
    this.accountAdmins = Object.keys(this.account.otherAdmins).map(key => this.account.otherAdmins[key]).join(', ');
    this.viewDetails = !this.viewDetails;
  }

  public enableAccount() {
    this.accountsService.enableAccount(this.account.uid, "Enabled by Admin via console").subscribe(account => {
      this.account = account;
    })
  }

  public disableAccount() {
    this.accountsService.disableAccount(this.account.uid, 'Disabled by Admin via console').subscribe(account => {
      this.account = account;
    })
  }

  public changeAccountDate() {
    this.onChangeBillingDateClicked.emit(this.account);
    return false;
  }

  public changeDataSets() {
    this.onChangeDatasetsClicked.emit(this.account);
    return false;
  }

  public changeUnitCosts() {
    this.onChangeAccountCostsClicked.emit(this.account);
    return false;
  }

}
