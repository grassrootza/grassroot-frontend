import {Component, OnInit} from '@angular/core';
import {UserProvince} from "../model/user-province.enum";
import {UserService} from "../user.service";
import {UserProfile} from "../user.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../utils/alert.service";

declare var $: any;

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css', '../profile-container/user-profile.component.css']
})
export class ProfileFormComponent implements OnInit {

  provinces = UserProvince;
  provinceKeys: string[];

  userProfile: UserProfile;
  profileForm: FormGroup;
  otpForm: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder,
              private alertService: AlertService) {
    this.provinceKeys = Object.keys(this.provinces);
    // todo : validation of numbers, email, etc
    console.log("empty profile looks like: ", new UserProfile());
    this.profileForm = this.formBuilder.group(new UserProfile());
    this.otpForm = this.formBuilder.group({
      'otp': ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    })
  }

  ngOnInit() {
    this.userProfile = new UserProfile(this.userService.getLoggedInUser());
    this.profileForm.setValue(this.userProfile);
  }

  saveChanges() {
    console.log("saving changes! form looks like: ", this.profileForm.value);
    this.userProfile = this.profileForm.value;
    this.userService.updateDetails(this.userProfile)
      .subscribe(message => {
        if (message == 'OTP_REQUIRED') {
          $('#enter-otp-modal').modal("show");
        } else if (message == 'UPDATED') {
          this.alertService.alert("user.profile.completed");
        }
    }, error => {
        console.log("that didn't work, error: ", error);
    })
  }

  submitOtp() {
    this.userService.updateDetails(this.userProfile, this.otpForm.value['otp'])
      .subscribe(message => {
        // really need that snackbar (or similar) design
        $("#enter-otp-modal").modal('hide');
        console.log("may have worked? ", message);
        this.alertService.alert("user.profile.completed");
      }, error => {
        // display an error message ...
        console.log("ah, an error: ", error);
      });
  }

}
