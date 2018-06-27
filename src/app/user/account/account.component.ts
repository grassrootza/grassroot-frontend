import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../utils/alert-service/alert.service";
import {UserService} from "../user.service";
import {AuthenticatedUser, UserProfile} from "../user.model";
import {AccountService} from "../account.service";
import { saveAs } from 'file-saver';

declare var $: any;


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  typesKeys: string[];

  billingCyclesKeys: string[];

  accountFees: any;

  loggedInUser: AuthenticatedUser;
  account: Account;
  accountForm: FormGroup;

  costSinceLastBill: number = 0;

  constructor(private userService: UserService,
              private accountService: AccountService,
              private formBuilder: FormBuilder,
              private alertService: AlertService) {

    this.accountForm = this.formBuilder.group({
      name:new FormControl('',Validators.required),
      billingUserEmail:new FormControl('',[Validators.required,Validators.pattern("[^ @]*@[^ @]*"),Validators.email]),
      type:new FormControl('',Validators.required),
      billingCycle: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.loggedInUser = this.userService.getLoggedInUser();

    // this.accountService.fetchAccountDetails().subscribe(account => {
    //   this.account = account;

    //   if(account) {
    //     this.accountForm.get('name').setValue(account.name);
    //     this.accountForm.get('billingUserEmail').setValue(account.billingUserEmail);

    //     if(account.billingUserUid !== this.loggedInUser.userUid) {
    //       this.accountForm.get('billingUserEmail').disable()
    //     }
    //     this.accountForm.get('type').setValue(account.type);
    //     this.accountForm.get('billingCycle').setValue(account.billingCycle);

    //     this.accountService.getCostSinceLastBill(this.account.uid).subscribe(resp => {
    //       this.costSinceLastBill = resp / 100;
    //     });

    //     this.accountService.getPastPayments(this.account.uid).subscribe(abr => {
    //       this.accountBillingRecords = abr;
    //     })
    //   }
    // });
  }

  showCloseModal() {
    $("#close-account-modal").modal("show");
  }

  confirmCloseAccount() {
    this.accountService.closeAccount(this.account.id).subscribe(resp => {
      $("#close-account-modal").modal("hide");
    });
  }

  saveChanges() {
    console.log("saving changes! form looks like: ", this.accountForm.value);
    const accountName = this.accountForm.get('name').value;
    const billingUserEmail = this.accountForm.get('billingUserEmail').value;
    const type = this.accountForm.get('type').value;
    const billingCycle = this.accountForm.get('billingCycle').value;

    this.accountService.updateAccount(this.account.id, accountName, billingUserEmail, type, billingCycle)
      .subscribe(message => {
        this.alertService.alert("user.account.completed");
      }, error => {
        console.log("that didn't work, error: ", error);
      })
  }


}
