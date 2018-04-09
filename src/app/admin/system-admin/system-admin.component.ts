import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';

declare var $: any;

@Component({
  selector: 'app-system-admin',
  templateUrl: './system-admin.component.html',
  styleUrls: ['./system-admin.component.css']
})
export class SystemAdminComponent implements OnInit {

  constructor(private adminService:AdminService) { }

  ngOnInit() {
  }

  loadUsers(searchTerm:string){
    console.log("Searching....",searchTerm);
    this.adminService.loadUser(searchTerm).subscribe(resp => {
      console.log("Loaded......",resp);
      $('#user-opt-out-modal').modal("show");
    },error => {
      console.log("Error loading user..",error);
    });
  }
  
  optOutUser(otp:string){
    console.log("Otp entered....",otp);
    this.adminService.optOutUser(otp).subscribe(resp => {
      $('#user-opt-out-modal').modal("hide");
    },error => {
      console.log("Error opting user out...",error);
    });
  }
}
