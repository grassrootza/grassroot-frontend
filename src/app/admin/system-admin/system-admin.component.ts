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
  public groupsNotFoundMessage:string;
  public invalidOtpMessage:string;
  public groupToActivateOrDeactivateUid:string;
  public searchTerm:string;
  public userRole:string = "ROLE_ORDINARY_MEMBER";
  public groupUid:string;

  public groups:GroupAdmin[] = [];
  
  constructor(private adminService:AdminService,
              private router:Router) { 
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
    console.log("Group uid.....",this.groupToActivateOrDeactivateUid);

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

  addMember(displayName:string,phoneNumber:string){
    this.adminService.addMember(phoneNumber,displayName,this.userRole,this.groupUid).subscribe(resp => {
      for(let grp of this.groups){
        if(grp.groupUid === this.groupUid){
          grp.memberCount += 1;
        }
      }
      $('#add-member-modal').modal("hide");
    },error => {
      console.log("Error adding member to group",error);
    });
  }
}
