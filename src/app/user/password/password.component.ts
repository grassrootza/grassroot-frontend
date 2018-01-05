import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css', '../profile-container/user-profile.component.css']
})
export class PasswordComponent implements OnInit {

  pwdForm: FormGroup;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) {
    this.pwdForm = formBuilder.group({
      'oldpassword': ['', Validators.required],
      'newpassword': ['', Validators.required],
      'confirmpwd' : ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  submitChange() {
    this.userService.updatePassword(this.pwdForm.value['oldpassword'], this.pwdForm.value['newpassword'], this.pwdForm.value['confirmpwd'])
      .subscribe(result => {
        // todo : as above, put in a message of some form
        console.log("worked? ", result);
        this.router.navigate(['/user/password']); // to clear form (to do better)
      }, error => {
        console.log("nope, failed", error);
      })
  }

}
