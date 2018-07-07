import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../utils/alert-service/alert.service";
import {UserService} from "../user.service";
import {AuthenticatedUser, UserProfile} from "../user.model";
import {AccountService} from "../account.service";
import { UserExtraAccount } from './account.user.model';
import { ActivatedRoute } from '@angular/router';

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
  account: UserExtraAccount;
  accountForm: FormGroup;

  costSinceLastBill: number = 0;

  paidForGroupUids: string[];
  otherAdminUids: string[];
  otherAccountUids: string[];

  removingAdminUid: string;

  groupCandidatesMap: any;
  groupCandidatesUids: string[];
  selectedGroupUidsToAdd: string[];

  constructor(private userService: UserService,
              private accountService: AccountService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private route: ActivatedRoute) {

    this.accountForm = this.formBuilder.group({
      name:['',Validators.required],
      adminPhoneOrEmail: ['']
    });
  }

  ngOnInit() {
    this.loggedInUser = this.userService.getLoggedInUser();
    
    this.route.params.subscribe(params => {
      let accountUid = params['id'];
      console.log('Have account uid? ', accountUid);
      if (accountUid) {
        this.fetchAccount(accountUid);
      } else {
        this.fetchAccount();
      }
    })
    
  }

  fetchAccount(accountUid?: string) {
    this.accountService.fetchAccountDetails(accountUid).subscribe(account => {
      console.log('account: ', account);
      this.account = account;
      this.accountForm.get('name').setValue(account.name);
      
      this.paidForGroupUids = Object.keys(account.paidForGroups);
      this.otherAdminUids = Object.keys(account.otherAdmins);
      
      if (account.otherAccounts) {
        this.otherAccountUids = Object.keys(account.otherAccounts);
        console.log('other account uids: ', this.otherAccountUids);
      }

      this.fetchCandidateGroupsToAdd(account.uid);
    });
  }

  fetchGroupNotifications(groupUid: string) {
    this.accountService.getGroupNotifications(this.account.uid, groupUid).subscribe(count => {
      console.log('count: ', count);
    })
    return false;
  }

  fetchCandidateGroupsToAdd(accountUid: string) {
    this.accountService.fetchGroupsThatCanAddToAccount(accountUid).subscribe(groupsMap => {
      console.log('returned groups map: ', groupsMap);
      this.groupCandidatesMap = groupsMap;
      this.groupCandidatesUids = Object.keys(groupsMap);
      console.log('and keys: ', this.groupCandidatesUids);
      setTimeout(() => this.showCandidateGroups(groupsMap), 300);
    })
  }

  showCandidateGroups(groupsMap: any) {
    $(".groups-add-select").select2({placeholder: "Select groups"});
  }

  showCloseModal() {
    $("#close-account-modal").modal("show");
  }

  confirmCloseAccount() {
    this.accountService.closeAccount(this.account.uid).subscribe(resp => {
      $("#close-account-modal").modal("hide");
    });
  }

  saveChanges() {
    console.log("saving changes! form looks like: ", this.accountForm.value);
    const accountName = this.accountForm.get('name').value;
    const billingUserEmail = this.accountForm.get('billingUserEmail').value;
    const type = this.accountForm.get('type').value;
    const billingCycle = this.accountForm.get('billingCycle').value;

    this.accountService.updateAccount(this.account.uid, accountName, billingUserEmail, type, billingCycle)
      .subscribe(message => {
        this.alertService.alert("user.account.completed");
      }, error => {
        console.log("that didn't work, error: ", error);
      })
  }

  makeAccountPrimary(accountUid: string) {
    this.accountService.makeAccountPrimary(accountUid).subscribe(account => {
      this.account = account;
    })
    return false;
  }

  addAdminMember() {
    let valueEntered = this.accountForm.get('adminPhoneOrEmail').value;
    console.log('value entered: ', valueEntered);
    this.accountService.addAdmin(this.account.uid, valueEntered).subscribe(failures => {
      console.log('failed admin adds: ', failures);
      this.accountForm.controls['adminPhoneOrEmail'].reset();
      this.fetchAccount(this.account.uid);
    })
  }

  removeAdminMember(adminUid: string) {
    this.removingAdminUid = adminUid;
    $('#remove-admin-modal').modal('show');
    return false;
  }

  confirmRemoveAdmin() {
    this.accountService.removeAdmin(this.account.uid, this.removingAdminUid).subscribe(account => {
      this.account = account;
      $('#remove-admin-modal').modal('hide');
      delete this.removingAdminUid;
    })
  }

  addGroupsToAccount() {
    const data = $('.groups-add-select').select2('data');
    console.log('selected groups data entity: ', data);
    this.selectedGroupUidsToAdd = data && data.length > 0 ? data.map(tt => tt.id) : null;
    console.log('groupUids to add: ', this.selectedGroupUidsToAdd);
    if (this.selectedGroupUidsToAdd) {
      this.alertService.showLoading();
      this.accountService.addGroups(this.account.uid, this.selectedGroupUidsToAdd).subscribe(account => {
        this.account = account;
        this.paidForGroupUids = Object.keys(account.paidForGroups);
        this.alertService.hideLoading();
        $('.groups-add-select').val(null).trigger('change');
      }, error => {
        this.alertService.hideLoading();
        console.log('Error adding groups: ', error);
      })
    }
  }

  showGroupModal(groupUid: string) {
    return false;
  }


}
