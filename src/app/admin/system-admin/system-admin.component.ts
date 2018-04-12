import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { Router } from '@angular/router'

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
  
  constructor(private adminService:AdminService,
              private router:Router) { }

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
}
