import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router';
import { GroupAdmin } from '../../groups/model/group-admin.model';

declare var $: any;

@Component({
  selector: 'app-system-admin',
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.css']
})
export class SystemAdminComponent implements OnInit {

  public userUid:string;
  public userNotFoundMessage:string;
  public invalidOtpMessage:string;
  public groupToActivateOrDeactivateUid:string;
  public searchTerm:string;
  public userRole:string = "ROLE_ORDINARY_MEMBER";
  public groupUid:string;

  public groups:GroupAdmin[] = [];
  
  constructor(private adminService:AdminService,
              private router:Router) { 
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }
  }

  ngOnInit() {
  }

  loadUsers(searchTerm:string){
    console.log("Searching....",searchTerm);
    this.adminService.loadUser(searchTerm).subscribe(resp => {
      console.log("Response....",resp);
      if(resp === ""){
        this.userNotFoundMessage = "User not found,type correct number or email";
        console.log("Message:",this.userNotFoundMessage);
        setTimeout(() => {
          this.userNotFoundMessage = "";
        }, 2000)
      }else{
        this.userUid = resp;
        $('#user-opt-out-modal').modal("show");
      }

    },error => {
      console.log("Error loading user..",error);
    });
  }
  
  optOutUser(otp:string){
    this.adminService.optOutUser(otp,this.userUid).subscribe(resp => {
      $('#user-opt-out-modal').modal("hide");
      this.router.navigate(["/home"]);
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
      this.router.navigate(["/home"]);
    },error => {
      console.log("Error updating password",error);
    });
  }

  searchGroups(groupName:string){
    console.log("Searching for group....",groupName);
    this.searchTerm = groupName;
    this.adminService.findGroups(groupName).subscribe(resp => {
      console.log("Resp ....",resp)
      this.groups = resp;
    },error => {
      console.log("Error loading goups",error);
    });
  }

  triggerActivateOrDeactivateModal(active:boolean,groupUid:string){
    console.log("Choosing modal....",active);
    console.log("Group uid m activating or deactivating....",groupUid);
    this.groupToActivateOrDeactivateUid = groupUid;
    if(active){
      $('#deactivate-group-modal').modal("show");
    }else{
      $('#activate-group-modal').modal("show");
    }
  }

  confirmDeactivate(){
    console.log("Group uid.....",this.groupToActivateOrDeactivateUid);
    this.adminService.deactivateGroup(this.groupToActivateOrDeactivateUid).subscribe(resp => {
      $('#deactivate-group-modal').modal("hide");
      this.refreshComponent();
    },error => {
      console.log("Error deactivating group...",error);
    });
  }

  confirmActivate(){
    this.adminService.activateGroup(this.groupToActivateOrDeactivateUid).subscribe(resp => {
      $('#activate-group-modal').modal("hide");
      this.refreshComponent();
      console.log("Was looking for groups with name ...",this.searchTerm);
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

  addMember(displayName:string,phoneNumber:string){
    this.adminService.addMember(phoneNumber,displayName,this.userRole,this.groupUid).subscribe(resp => {
      $('#add-member-modal').modal("hide");
    },error => {
      console.log("Error adding member to group",error);
    });
  }

  refreshComponent(){
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
  }
}
