import {Component, OnInit} from '@angular/core';
import {FormBuilder,  FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../utils/alert-service/alert.service";
import {UserService} from "../user.service";
import {AuthenticatedUser} from "../user.model";
import {AccountService} from "../account.service";
import { UserExtraAccount } from './account.user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../groups/model/group.model';
import { DataSetCounts } from './dataset.count.model';

import { saveAs } from 'file-saver';
import { CampaignInfo } from 'app/campaigns/model/campaign-info';
import { DateTimeUtils,epochMillisFromDate } from 'app/utils/DateTimeUtils';

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
  ussdSessionsSinceLastBill: number = 0;

  paidForGroupUids: string[];
  otherAdminUids: string[];
  otherAccountUids: string[];

  removingAdminUid: string;

  groupCandidatesMap: any;
  groupCandidatesUids: string[];
  selectedGroupUidsToAdd: string[];

  groupToView: Group;
  groupToViewCount: number;

  accountCampaigns: CampaignInfo[];
  campaignBillingStats: any;

  dataSetCounts: DataSetCounts[];

  constructor(private userService: UserService,
              private accountService: AccountService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private route: ActivatedRoute,
              private router: Router) {
    this.accountForm = this.formBuilder.group({
      name:['',Validators.required],
      adminPhoneOrEmail: [''],
      'startDate': [DateTimeUtils.nowAsDateStruct(), Validators.required],
      'endDate': [DateTimeUtils.futureDateStruct(3, 0), Validators.required]
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
      this.ussdSessionsSinceLastBill = account.chargedUssdSinceLastBill;
      console.log('ussd sessions: ', this.ussdSessionsSinceLastBill);
      
      console.log('last billing date millis: ', account.lastBillingDateMillis);
      this.dateOfLastBill = account.getLastBillingDate();
      console.log(`${this.notificationsSinceLastBill} since ${this.dateOfLastBill}`);
      
      if (account.otherAccounts) {
        this.otherAccountUids = Object.keys(account.otherAccounts);
        console.log('other account uids: ', this.otherAccountUids);
      }

      if (account.geoDataSets) {
        this.fetchDataSetDetails(account.uid);
      }

      this.fetchCampaigns(account.uid);
      this.fetchCandidateGroupsToAdd(account.uid);
    });
  }

  fetchDataSetDetails(accountUid?: string) {
    this.accountService.getDetailsOfDataSets(accountUid).subscribe(counts => {
      console.log('dataset counts: ', counts);
      this.dataSetCounts = counts;
    }, error => {
      console.log('error fetching counts: ', error);
    })
  }

  fetchCampaigns(accountUid: string) {
    this.accountService.getCampaigns(accountUid).subscribe(campaigns => {
      console.log('Fetched campaigns for account : ', campaigns);
      this.accountCampaigns = campaigns;
    })
  }

  viewCampaign(campaignUid: string) {
    console.log('Campaign UID passed from component: ', campaignUid);
    this.accountService.getCampaignBillingStats(this.account.uid, campaignUid).subscribe(stats => {
      console.log('Campaign billing stats: ', stats);
      this.campaignBillingStats = stats;
      $('#account-campaign-modal').modal('show');
    });
    return false;
  }

  goToCampaign(campaignUid: string) {
    $('#account-campaign-modal').modal('hide');
    this.router.navigate(['/campaign', campaignUid]);
  }

  viewGroup(groupUid: string) {
    this.alertService.showLoading();
    this.accountService.getInfoOfGroupOnAccount(groupUid).subscribe(group => {
      console.log('Fetched group info, result: ', group);
      this.groupToView = group;
      this.fetchGroupNotifications(groupUid);
    }, error => {
      console.log('Error loading group: ', error);
      this.alertService.hideLoading();
      this.alertService.alert('Sorry, there was an error loading the group details');
    });
    return false;
  }

  fetchGroupNotifications(groupUid: string) {
    this.accountService.getGroupNotifications(this.account.uid, groupUid).subscribe(count => {
      // console.log('count: ', count);
      this.groupToViewCount = count;
      this.alertService.hideLoading();
      $('#account-group-modal').modal('show');
    }, error => {
      console.log('Error fetching group notificationc count: ', error);
      this.alertService.hideLoading();
      this.alertService.alert('Sorry, there was an error loading the group details');
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
      // console.log('returned groups map: ', groupsMap);
      this.groupCandidatesMap = groupsMap;
      this.groupCandidatesUids = Object.keys(groupsMap);
      // console.log('and keys: ', this.groupCandidatesUids);
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
      if (resp == 'closed') {
        this.alertService.alert('Done! Account closed', true);
        if (this.otherAccountUids && this.otherAccountUids.length > 0)
          this.router.navigate(['/user', 'account']);
        else
          this.router.navigate(['/home']);
      } else {
        this.alertService.alert('Sorry, there was an error closing the account. Please contact accounts');
      }
    }, error => {
      $("#close-account-modal").modal("hide");
    });
  }

  saveChanges() {
    // console.log("saving changes! form looks like: ", this.accountForm.value);
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

  downloadAccountActivity() {
    this.alertService.showLoading();
    this.accountService.downloadActivity(this.account.uid).subscribe(data => {
      this.alertService.hideLoading();
      const blob = new Blob([data], { type: 'application/xls' });
      saveAs(blob, this.account.name + '.xlsx'); 
    }, error => {
      this.alertService.hideLoading();
      console.log('error downloading activity: ', error);
      this.alertService.alert('Sorry, there was an error downloading the sheet');
    });
    return false;
  }

  logout() {
    this.userService.logout(false, '/login');
    return false;
  }

  downloadAllBillingData(){
    let startDateMills = epochMillisFromDate(this.accountForm.controls.startDate.value);
    let endDateMills = epochMillisFromDate(this.accountForm.controls.endDate.value);

    console.log("start Date millis ........",startDateMills);
    console.log("end Date millis ........",endDateMills);

    this.accountService.downloadAllBillingData(this.account.uid,startDateMills,endDateMills).subscribe(data =>{
      let blob = new Blob([data], { type: 'application/xls' });
      saveAs(blob, this.account.name + "-All Campaigns BillingData.xls")
    },error => {
      console.log("Error download all billing data @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    });

    return false;
  }
}
