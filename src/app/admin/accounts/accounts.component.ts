import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  constructor(private accountsService: AccountsService) { }

  ngOnInit() {
    this.accountsService.listCurrentAccounts().subscribe(accounts => {
      console.log('accounts: ', accounts);
    }, error => {
      console.log('error fetching accounts: ', error);
    })
  }

}
