import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {AlertService} from "../../utils/alert-service/alert.service";

@Component({
  selector: 'app-password',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.css', '../profile-container/user-profile.component.css']
})
export class UserDeleteComponent implements OnInit {

  requestOtp: boolean;
  otp: string;
  displayError: boolean;
  errorMessageKey: string;

  constructor(private userService: UserService, private router: Router,
              private alertService: AlertService) {
  }

  ngOnInit() {
  }

  initiateDelete() {
    this.userService.initiateUserDelete().subscribe(result => {
      this.requestOtp = true;
    }, error => {
      console.log("error initiating delete: ", error);
      this.displayError = true;
      this.errorMessageKey = "user.delete.error-unknown";
    });
  }

  completeDelete() {
    console.log("otp? : ", this.otp);
    this.userService.completeUserDelete(this.otp).subscribe(result => {
      this.alertService.alert('user.delete.done', true);
      this.userService.logout(false, '/');
    }, error => {
      this.displayError = true;
      this.errorMessageKey = "user.delete.otp-error";
    })
  }

}
