import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { GroupAdmin } from '../../groups/model/group-admin.model';
import { AlertService } from '../../utils/alert-service/alert.service';
import { UserProvince } from '../../user/model/user-province.enum';
import { LiveWireAdminService } from '../livewire/livewire-admin-service';
import { DataSubscriber } from '../livewire/model/data-subscriber.model';
import { ConfigVariable } from './config-variable.model';
import { debounceTime } from 'rxjs/operators'
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/debounceTime';

import { saveAs } from 'file-saver';

declare var $: any;

@Component({
  selector: 'app-system-admin',
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.css']
})
export class SystemAdminComponent implements OnInit {

  public userUid: string;
  
  public userNotFoundMessage: string;
  public groupsNotFoundMessage: string;
  
  public invalidOtpMessage: string;
  public groupToActivateOrDeactivateUid: string;
  public searchTerm: string;
  public userRole: string = "ROLE_ORDINARY_MEMBER";
  public groupUid: string;
  public userGroups: number;
  public province: string;
  public numberOfGroups: number = 10;
  public totalGroupsLoaded: number;

  public groups:GroupAdmin[] = [];

  newValueFormControl = new FormControl();
  formCtrlSub: Subscription;

  //Fields used in livewire subscriber account management
  public livewireSubscribers:DataSubscriber[] = [];
  public addPrimaryEmail:boolean;
  public makeAccountActive:boolean;
  public errorCreatingSubscriberMessage:string;

  userProvince = UserProvince;
  provinceKeys: string[];

  public configVariableList:ConfigVariable[] = [];
  
  public configVarToUpdate: ConfigVariable;

  public deleteConfigVariableKey:string;

  public groupSizeLimitKey = 'groups.size.freemax';
  public numberBelow: number;
  public numberAbove: number;
  geoBatchSize: number = 10;

  public allUsersWithCoordinates: number;
  public usersCountWithinTimeStamp: number;

  public numberGroupOrganizerMessages: number;

  accessToken: string;
  
  constructor(private adminService:AdminService,
              private alertService:AlertService,
              private livewireAdminService:LiveWireAdminService) { 
    this.provinceKeys = Object.keys(this.userProvince);
    this.addPrimaryEmail = false;
    this.makeAccountActive = false;
  }

  ngOnInit() {
    this.livewireAdminService.allSubscribers().subscribe(resp => {
      this.livewireSubscribers = resp;
    },error => {
      console.log("Error loading subscribers...",error);
    });

    //Fetching all the users with gps coordinates since the the beginning of the platform initiated
    this.adminService.countAllUsersWithLocation(true).subscribe(resp => {
      this.allUsersWithCoordinates = resp;
    },error => {
      console.log("Error fetching count results for all users with coordinates: ", error);
    });

    //Fetching all the users with gps coordinates since the the beginning of the platform initiated
    this.adminService.countAllUsersWithLocation(false).subscribe(resp => {
      this.usersCountWithinTimeStamp = resp;
    },error => {
      console.log("Error fetching count results for all users with coordinates: ", error);
    });

    this.adminService.listAllConfigVariables().subscribe(resp => {
      this.configVariableList = resp;
      console.log("Config variable list from server: ", this.configVariableList);
    },error => {
      console.log("Error fecthing config variables:", error);
    });

    this.formCtrlSub = this.newValueFormControl.valueChanges
      .debounceTime(300)
      .subscribe(newValue => {
        if (this.configVarToUpdate && this.configVarToUpdate.key == this.groupSizeLimitKey)
          this.onSizeChange(newValue)
      });
  }

  loadUsers(searchTerm:string){
    this.adminService.loadUser(searchTerm).subscribe(resp => {
      if(resp === ""){
        this.userNotFoundMessage = "User not found, type correct number or email";
        setTimeout(() => {
          this.userNotFoundMessage = "";
        }, 2000)
      }else{
        this.userUid = resp;
        this.numberOfUserGroups(this.userUid);
        $('#user-opt-out-modal').modal("show");
      }

    },error => {
      console.log("Error loading user..",error);
    });
  }

  numberOfUserGroups(userUid:string){
    this.adminService.numberOfGroupsUserIsPartOf(userUid).subscribe(resp => {
      this.userGroups = resp;
    },error => {
      console.log("Error getting number of user groups...",error);
    });
  }
  
  optOutUser(otp:string){
    this.adminService.optOutUser(otp,this.userUid).subscribe(_ => {
      $('#user-opt-out-modal').modal("hide");
      this.alertService.alert('Done, user has been opted out of their groups');
    },error => {
      console.log("Error opting user out...",error);
      this.invalidOtpMessage = "Error! invalid OTP";
      setTimeout(() => this.invalidOtpMessage = "", 2000);
    });
  }
  
  resetUserPwd(otp:string){
    this.adminService.resetUserPassword(otp,this.userUid).subscribe(_ => {
      $('#user-opt-out-modal').modal("hide");
      this.alertService.alert('Done, user password reset and sent to them');
    },error => {
      console.log("Error updating password",error);
    });
  }

  recycleJoinCodes() {
    this.adminService.recycleGroupJoinCodes().subscribe(number => {
      console.log('Succeeded! Tokens refreshed');
      this.alertService.alert('Recycled ' + number + ' join tokens');
    }, error => {
      console.log('Error initiating recycle, error: ', error);
    })
  }

  searchGroups(groupName:string){
    this.searchTerm = groupName;
    this.adminService.findGroups(groupName).subscribe(resp => {
      this.groups = resp;
      this.totalGroupsLoaded = this.groups.length;
      if (this.groups.length === 0) {
        this.groupsNotFoundMessage = "No groups found!";
        setTimeout(()=> this.groupsNotFoundMessage = "", 2000);
      }
    },error => {
      console.log("Error loading goups",error);
    });
  }

  triggerActivateOrDeactivateModal(active:boolean,groupUid:string){
    this.groupToActivateOrDeactivateUid = groupUid;
    if(active)
      $('#deactivate-group-modal').modal("show");
    else
      $('#activate-group-modal').modal("show");
  }

  confirmDeactivate(){
    this.adminService.deactivateGroup(this.groupToActivateOrDeactivateUid).subscribe(resp => {
      this.groups.filter(grp => grp.groupUid == this.groupToActivateOrDeactivateUid).forEach(grp => grp.active = false);
      $('#deactivate-group-modal').modal("hide");
    },error => {
      console.log("Error deactivating group...",error);
    });
  }

  confirmActivate(){
    this.adminService.activateGroup(this.groupToActivateOrDeactivateUid).subscribe(resp => {
      this.groups.filter(grp => grp.groupUid == this.groupToActivateOrDeactivateUid).forEach(grp => grp.active = true);
      $('#activate-group-modal').modal("hide");
    },error => {
      console.log("Error Activatin Group...",error);
    });
  }

  triggerAddMemberModal(groupUid:string){
    this.groupUid = groupUid;
    $('#add-member-modal').modal("show");
  }

  onChangeSelectRole(role:string){
    this.userRole = role;
  }

  onChangeSelectProvince(province:string){
    this.province = province;
  }

  addMember(displayName:string,phoneNumber:string,email:string){
    this.adminService.addMember(phoneNumber,displayName,this.userRole,this.groupUid,email,this.province).subscribe(resp => {
      console.log("Response...",resp);
      $('#add-member-modal').modal("hide");
      if(resp == "UPLOADED"){
        this.alertService.alert("group.allMembers.addMember.complete");
        this.groups.filter(grp => grp.groupUid == this.groupToActivateOrDeactivateUid).forEach(grp => grp.memberCount += 1);
      } else if(resp == "UPDATED") {
        this.alertService.alert("group.allMembers.addMember.updated");
      }
    },error => {
      console.log("Error adding member to group",error);
      this.alertService.alert("Error adding member!");
    });
  }

  showMoreGroups(){
    if(this.totalGroupsLoaded > this.numberOfGroups)
      this.numberOfGroups += 10;
  }

  showFewerGroups(){
    if(this.numberOfGroups > 10)
      this.numberOfGroups -= 10;
  }

  triggerCreateSubscriberModal(){
    $('#create-subscriber-modal').modal("show");
  }

  createSubscriber(subscriberName:string,primaryEmail:string,otherEmails:string){
    this.livewireAdminService.createSubscriber(subscriberName,primaryEmail,this.addPrimaryEmail,otherEmails,this.makeAccountActive).subscribe(resp => {
      if (resp == 'ACCOUNT_CREATED') {
        $('#create-subscriber-modal').modal("hide");
        this.alertService.alert("Done, subscriber created successfully.");
      } else if(resp == 'ERROR') {
        this.errorCreatingSubscriberMessage = "Error! Subscriber account not created. Please make sure all input fields are valid.";
        setTimeout(()=>{
          this.errorCreatingSubscriberMessage = "";
        }, 2000);
      }
    }, error => {
      console.log("Error creating subscriber......",error);
    });
  }

  fetchApiToken() {
    this.adminService.fetchAccessToken().subscribe(token => this.accessToken = token, 
      error => console.log('Error fetching token!: ', error));
    return false;
  }

  fetchLiveWireApiToken(subscriberUid: string) {
    this.livewireAdminService.fetchLiveWireApiToken(subscriberUid).subscribe(token => this.accessToken = token, 
      error => console.log('Error fetching token!: ', error));
    return false;
  }

  exportWhatsAppOptIn(){
    console.log("Calling method for exporting whatsapp spreadsheet");
    this.adminService.downloadWhatsAppOptedInUsers().subscribe(data => {
        let blob = new Blob([data], {type: 'application/xls'});
        saveAs(blob,  "whats_app_users.xlsx");
    }, error => {
      console.log("error getting a list of subscribed users ", error);
      this.alertService.alert('Sorry, there was an error downloading the opted in users, please see logs');
    });
    return false;
  }

  openCreateConfigVarModal(){
    $('#create-config-variable-modal').modal("show");
  }

  createConfigVariable(key:string,value:string,desc:string){
    this.adminService.createConfigVariable(key,value,desc).subscribe(_ => {
      $('#create-config-variable-modal').modal("hide");
      this.alertService.alert('Done, alert created');
      this.fetchConfigVariables();
    }, error => {
      console.log("Error creating config variable: ", error);
    });
  }

  openUpdateConfigVarModal(updateConfigVarkey:string) {
    console.log("Updating config variable with key --->>>",updateConfigVarkey);
    $('#update-config-variable-modal').modal("show");
    this.configVarToUpdate = this.configVariableList.find(variable => variable.key == updateConfigVarkey);
    if (updateConfigVarkey == this.groupSizeLimitKey) {
      console.log('Updating group size limit, existing var: ', this.configVarToUpdate);
      this.onSizeChange(parseInt(this.configVarToUpdate.value));
    }
  }

  updateConfigVariable(newValue:string,newDesc:string){
    this.adminService.updateConfigVariable(this.configVarToUpdate.key, newValue, newDesc).subscribe(resp => {
      console.log("SERVER RESPONDED ............",resp);
      $('#update-config-variable-modal').modal("hide");
      this.fetchConfigVariables();
    }, error => {
      console.log("Error updating config variable.........",error);
    });
  }

  fetchConfigVariables(){
    this.adminService.listAllConfigVariables().subscribe(resp => {
      this.configVariableList = resp;
    },error => {
      console.log("Error fecthing all variables .....................",error);
    });
  }

  openRemoveConfigVariableConfirmModal(deleteConfigVariableKey:string){
    this.deleteConfigVariableKey = deleteConfigVariableKey;
    $('#delete-config-variable-modal').modal('show');
    if(this.deleteConfigVariableKey == this.groupSizeLimitKey){
      this.calculateGroupsAboveLimit();
      this.calculateGroupsBelowLimit();
    }
  }

  deleteConfigVariable() {
    this.adminService.deleteCV(this.deleteConfigVariableKey).subscribe(resp => {
      $('#delete-config-variable-modal').modal('hide');
      this.fetchConfigVariables();
    }, error => {
      console.log("Error deleting cv");
    });
  }

  calculateGroupsAboveLimit() {
    this.adminService.getNumberGroupsAboveFreeLimit().subscribe(resp => {
      this.numberAbove = resp;
    },error => {
      console.log("Error getting number of groups above limit........",error);
    });
  }

  calculateGroupsBelowLimit(){
    this.adminService.getNumberGroupsBelowFreeLimit().subscribe(resp => {
      this.numberBelow = resp;
    },error => {
      console.log("Error getting number of groups below limit........",error);
    });
  }

  onSizeChange(size:number) {
    this.adminService.countGroupsBelowLimit(size).subscribe(resp => {
      console.log("Number of groups below limit is >",resp);
      this.numberBelow = resp;
    },error => {
      console.log("Error counting groups: ", error)
    });

    this.adminService.countGroupsAboveLimit(size).subscribe(resp => {
      this.numberAbove = resp;
    },error => {
      console.log("error counting groups: ", error)
    });
  }

  // Refreshing the users cache 
  triggerBatchMunicipalityFetch(){
    this.adminService.triggerMunicipalityFetch(this.geoBatchSize).subscribe(resp => {
      this.alertService.alert("Fetch / refresh triggered");
    }, error => {
      this.alertService.alert("Error refreshing the user location log cache");
      console.log("Error refreshing the user location log cache",error)
    })
  }

  saveLocationsFromAddress() {
    console.log('batch size: ', this.geoBatchSize);
    this.adminService.saveUserLocationsFromAddress(this.geoBatchSize).subscribe(resp => {
      this.alertService.alert("Saved addresses to location logs");
    },error => {
      console.log("Error saving location logs from address", error);
    });
    return false;
  }

  // public lousyAngularCheckboxDryRun = false;

  sendGroupOrganizerMessage(messageToSend, notDryRun) {
    console.log('Not dry run: ? ', notDryRun);
    console.log('As boolean: ', !!notDryRun);
    this.adminService.sendMessageToGroupOrganizers(messageToSend, !!notDryRun).subscribe(resp => {
      console.log("Successfully sent: ", resp);
      this.numberGroupOrganizerMessages = resp;
    }, error => {
      console.log("Error sending messages: ", error);
    });
    return false;
  }
}