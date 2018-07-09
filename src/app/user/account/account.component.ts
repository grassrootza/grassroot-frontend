import {Component, OnInit} from '@angular/core';
import {FormBuilder,  FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../utils/alert-service/alert.service";
import {UserService} from "../user.service";
import {AuthenticatedUser} from "../user.model";
import {AccountService} from "../account.service";
import { UserExtraAccount } from './account.user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../groups/model/group.model';
import { GroupService } from '../../groups/group.service';

import * as moment from "moment";

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

  dateOfLastBill: string;
  notificationsSinceLastBill: number = 0;

  paidForGroupUids: string[];
  otherAdminUids: string[];
  otherAccountUids: string[];

  removingAdminUid: string;

  groupCandidatesMap: any;
  groupCandidatesUids: string[];
  selectedGroupUidsToAdd: string[];

  groupToView: Group;
  groupToViewCount: number;

  constructor(private userService: UserService,
              private accountService: AccountService,
              private groupService: GroupService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private route: ActivatedRoute,
              private router: Router) {

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

      this.notificationsSinceLastBill = account.notificationsSinceLastBill;
      console.log('last billing date millis: ', account.lastBillingDateMillis);
      this.dateOfLastBill = moment(account.lastBillingDateMillis).format('Do MMMM YYYY');
      console.log(`${this.notificationsSinceLastBill} since ${this.dateOfLastBill}`);
      
      if (account.otherAccounts) {
        this.otherAccountUids = Object.keys(account.otherAccounts);
        console.log('other account uids: ', this.otherAccountUids);
      }

      this.fetchCandidateGroupsToAdd(account.uid);
    });
  }

  viewGroup(groupUid: string) {
    this.groupService.loadGroupDetailsFromServer(groupUid).subscribe(group => {
      this.groupToView = group;
      this.fetchGroupNotifications(groupUid);
    });
    return false;
  }

  fetchGroupNotifications(groupUid: string) {
    this.accountService.getGroupNotifications(this.account.uid, groupUid).subscribe(count => {
      console.log('count: ', count);
      this.groupToViewCount = count;
      $('#account-group-modal').modal('show');
    })
  }

  // have to close modal, hence through here
  goToGroupDashboard(groupUid: string) {
    $('#account-group-modal').modal('hide');
    this.router.navigate(['/group', groupUid]);
  }

  removeGroupFromAccount(groupUid: string) {
    this.accountService.removeGroup(this.account.uid, groupUid).subscribe(account => {
      this.account = account;
      this.paidForGroupUids = Object.keys(account.paidForGroups);
      $('#account-group-modal').modal('hide');  
    }, error => {
      console.log('error removing group from account: ', error);
      this.alertService.alert('Sorry, there was an error removing the group');
      $('#account-group-modal').modal('hide');
    })
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
