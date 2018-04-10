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

  public userToOptoutUid:string;
  
  constructor(private adminService:AdminService,
              private router:Router) { }

  ngOnInit() {
  }

  loadUsers(searchTerm:string){
    console.log("Searching....",searchTerm);
    this.adminService.loadUser(searchTerm).subscribe(resp => {
      this.userToOptoutUid = resp.id;
      $('#user-opt-out-modal').modal("show");
    },error => {
      console.log("Error loading user..",error);
    });
  }
  
  optOutUser(otp:string){
    this.adminService.optOutUser(otp,this.userToOptoutUid).subscribe(resp => {
      $('#user-opt-out-modal').modal("hide");
      this.router.navigate(["/home"]);
    },error => {
      console.log("Error opting user out...",error);
    });
  }
}
