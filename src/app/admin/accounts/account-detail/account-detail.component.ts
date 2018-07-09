import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionAccount } from '../subscription-account.model';
import { AccountsAdminService } from '../../admin-accounts.service';
import { UserExtraAccount } from '../../../user/account/account.user.model';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {

  @Input() public account: UserExtraAccount;
  public viewDetails: boolean = false;

  constructor(private accountsService: AccountsAdminService) { }

  ngOnInit() {
  }

  public toggleAccountDetails() {
    this.viewDetails = !this.viewDetails;
  }

}
