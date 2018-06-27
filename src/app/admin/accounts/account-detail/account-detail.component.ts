import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionAccount } from '../account.model';
import { AccountsService } from '../../accounts.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {

  @Input() public account: SubscriptionAccount;
  public viewDetails: boolean = false;

  constructor(private accountsService: AccountsService) { }

  ngOnInit() {
  }

  public toggleAccountDetails() {
    this.viewDetails = !this.viewDetails;
  }

}
