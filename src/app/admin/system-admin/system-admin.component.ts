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

declare var $: any;

@Component({
  selector: 'app-system-admin',
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.css']
})
export class SystemAdminComponent implements OnInit {

  public userUid:string;
  public userNotFoundMessage:string;
  public groupsNotFoundMessage:string;
  public invalidOtpMessage:string;
  public groupToActivateOrDeactivateUid:string;
  public searchTerm:string;
  public userRole:string = "ROLE_ORDINARY_MEMBER";
  public groupUid:string;
  public userGroups:number;
  public province:string;
  public numberOfGroups:number = 10;
  public totalGroupsLoaded:number;

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
  public updateConfigVarkey:string;
  public deleteConfigVariableKey:string;

  public numberBelow:number;
  public numberAbove:number;

  accessToken: string;
  
  constructor(private adminService:AdminService,
              private router:Router,
              private alertService:AlertService,
              private livewireAdminService:LiveWireAdminService) { 
    this.provinceKeys = Object.keys(this.userProvince);
    this.addPrimaryEmail = false;
    this.makeAccountActive = false;
  }

  ngOnInit() {
    this.livewireAdminService.allSubscribers().subscribe(resp => {
      console.log("Subscribers........",resp);
      this.livewireSubscribers = resp;
    },error => {
      console.log("Error loading subscribers...",error);
    });

    this.adminService.listAllConfigVariables().subscribe(resp => {
      this.configVariableList = resp;
      console.log("SERVER RESPONDED ...........",this.configVariableList);
    },error => {
      console.log("Error fecthing all variables .....................",error);
    });

    this.formCtrlSub = this.newValueFormControl.valueChanges
      .debounceTime(3000)
      .subscribe(newValue => this.onSizeChange(newValue));
  }

  loadUsers(searchTerm:string){
    this.adminService.loadUser(searchTerm).subscribe(resp => {
      if(resp === ""){
        this.userNotFoundMessage = "User not found,type correct number or email";
        setTimeout(() => {
          this.userNotFoundMessage = "";
        }, 2000)
      }else{
        this.userUid = resp;
        this.numberOfUserGrooups(this.userUid);
        $('#user-opt-out-modal').modal("show");
      }

    },error => {
      console.log("Error loading user..",error);
    });
  }

  numberOfUserGrooups(userUid:string){
    this.adminService.numberOfGroupsUserIsPartOf(userUid).subscribe(resp => {
      this.userGroups = resp;
    },error => {
      console.log("Error getting number of user groups...",error);
    });
  }
  
  optOutUser(otp:string){
    this.adminService.optOutUser(otp,this.userUid).subscribe(resp => {
      $('#user-opt-out-modal').modal("hide");
    },error => {
      console.log("Error opting user out...",error);
      this.invalidOtpMessage = "Error! invalid OTP";
      setTimeout(() => {
        this.invalidOtpMessage = "";
      },2000);
    });
  }
  
  resetUserPwd(otp:string){
    this.adminService.resetUserPassword(otp,this.userUid).subscribe(resp => {
      $('#user-opt-out-modal').modal("hide");
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
      console.log("Response....",resp);
      this.groups = resp;
      this.totalGroupsLoaded = this.groups.length;
      if(this.groups.length === 0){
        this.groupsNotFoundMessage = "No groups found!";
        setTimeout(()=>{
          this.groupsNotFoundMessage = "";
        },2000);
      }
    },error => {
      console.log("Error loading goups",error);
    });
  }

  triggerActivateOrDeactivateModal(active:boolean,groupUid:string){
    
    this.groupToActivateOrDeactivateUid = groupUid;

    if(active){
      $('#deactivate-group-modal').modal("show");
    }else{
      $('#activate-group-modal').modal("show");
    }
  }

  confirmDeactivate(){
    this.adminService.deactivateGroup(this.groupToActivateOrDeactivateUid).subscribe(resp => {
      for(let grp of this.groups){
        if(grp.groupUid === this.groupToActivateOrDeactivateUid){
          grp.active = false;
        }
      }
      $('#deactivate-group-modal').modal("hide");
    },error => {
      console.log("Error deactivating group...",error);
    });
  }

  confirmActivate(){
    this.adminService.activateGroup(this.groupToActivateOrDeactivateUid).subscribe(resp => {
      for(let grp of this.groups){
        if(grp.groupUid === this.groupToActivateOrDeactivateUid){
          grp.active = true;
        }
      }
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
        for(let grp of this.groups){
          if(grp.groupUid === this.groupUid){
            grp.memberCount += 1;
          }
        }
      }else if(resp == "UPDATED"){
        this.alertService.alert("group.allMembers.addMember.updated");
      }
      
    },error => {
      console.log("Error adding member to group",error);
    });
  }

  showMore(){
    if(this.totalGroupsLoaded > this.numberOfGroups){
      this.numberOfGroups += 10;
    }
  }

  showLess(){
    if(this.numberOfGroups > 10){
      this.numberOfGroups -= 10;
    }
  }

  triggerCreateSubscriberModal(){
    $('#create-subscriber-modal').modal("show");
  }

  createSubscriber(subscriberName:string,primaryEmail:string,otherEmails:string){
    this.livewireAdminService.createSubscriber(subscriberName,primaryEmail,this.addPrimaryEmail,otherEmails,this.makeAccountActive).subscribe(resp => {
      if(resp == 'ACCOUNT_CREATED'){
        $('#create-subscriber-modal').modal("hide");
        this.alertService.alert("Done, subscriber created successfully.");
      }else if(resp == 'ERROR'){
        this.errorCreatingSubscriberMessage = "Error! Subscriber account not created. Please make sure all input fields are valid.";
        setTimeout(()=>{
          this.errorCreatingSubscriberMessage = "";
        }, 2000);
      }
    },error => {
      console.log("Error creating subscriber......",error);
    });
  }

  fetchApiToken() {
    this.adminService.fetchAccessToken().subscribe(token => {
      this.accessToken = token;
    }, error => {
      console.log('Error fetching token!: ', error);
    });
    return false;
  }

  openCreateConfigVarModal(){
    $('#create-config-variable-modal').modal("show");
  }


  createConfigVariable(key:string,value:string,desc:string){
    this.adminService.createConfigVariable(key,value,desc).subscribe(resp => {
      $('#create-config-variable-modal').modal("hide");
      this.fetchConfigVariables();
    },error => {
      console.log("Error creating config variable................");
    });
  }

  openUpdateConfigVarModal(updateConfigVarkey:string){
    console.log("Updating config variable with key --->>>",updateConfigVarkey);
    $('#update-config-variable-modal').modal("show");
    this.updateConfigVarkey = updateConfigVarkey;
    if(this.updateConfigVarkey == 'groups.size.freemax'){
      this.aboveCV();
      this.belowCV();
    }
  }

  updateConfigVariable(newValue:string,newDesc:string){
    this.adminService.updateConfigVariable(this.updateConfigVarkey,newValue,newDesc).subscribe(resp => {
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
    if(this.deleteConfigVariableKey == 'groups.size.freemax'){
      this.aboveCV();
      this.belowCV();
    }
  }

  deleteCV(){
    this.adminService.deleteCV(this.deleteConfigVariableKey).subscribe(resp => {
      $('#delete-config-variable-modal').modal('hide');
      this.fetchConfigVariables();
    }, error => {
      console.log("Error deleting cv");
    });
  }

  aboveCV(){
    this.adminService.getNumberGroupsAboveFreeLimit().subscribe(resp => {
      this.numberAbove = resp;
    },error => {
      console.log("Error getting number of groups above limit........",error);
    });
  }

  belowCV(){
    this.adminService.getNumberGroupsBelowFreeLimit().subscribe(resp => {
      this.numberBelow = resp;
    },error => {
      console.log("Error getting number of groups below limit........",error);
    });
  }

  onSizeChange(size:number){
    this.adminService.countGroupsBelowLimit(size).subscribe(resp => {
      console.log("Number of groups below limit is >",resp);
      this.numberBelow = resp;
    },error => {
      console.log("Error counting groups................")
    });

    this.adminService.countGroupsAboveLimit(size).subscribe(resp => {
      this.numberAbove = resp;
    },error => {
      console.log("error counting groups................");
    });
  }

}
