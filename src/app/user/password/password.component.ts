import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {FormBuilder, FormGroup, Validators,AbstractControl} from "@angular/forms";
import {Router} from "@angular/router";
import {AlertService} from "../../utils/alert.service";

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css', '../profile-container/user-profile.component.css']
})
export class PasswordComponent implements OnInit {

  pwdForm: FormGroup;
  errorMessage: string;

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router,
              private alertService: AlertService) {
    this.pwdForm = formBuilder.group({
      'oldpassword': ['', Validators.required],
      'newpassword': ['', Validators.required],
      'confirmpwd' : ['', Validators.required]
    },{validator:this.comparePasswords});
  }

  ngOnInit() {
  }

  submitChange() {
      this.userService.updatePassword(this.pwdForm.value['oldpassword'], this.pwdForm.value['newpassword'], this.pwdForm.value['confirmpwd'])
        .subscribe(result => {
          // server only returns 200 if this succeeded, and that's all it returns
          this.alertService.alert("user.password.completed");
          this.pwdForm.reset();
        }, error => {
          console.log("nope, failed: ", error);
          this.showFailure();
        })
    
  }

  // for security, we receive little to no information about what the eror was
  showFailure() {
    this.errorMessage = "user.password.error";
    setTimeout(() => {
      this.errorMessage = "";
    }, 2000)
  }

  passwordMismatch(){
    this.errorMessage = "user.password.mismatch";
    setTimeout(() => {
      this.errorMessage = "";
    }, 2000)
  }

  comparePasswords(control:AbstractControl){
      let password = control.get('newpassword').value;
      let confirmPassword = control.get('confirmpwd').value;

      if(password != confirmPassword){
          control.get('confirmpwd').setErrors({MatchPassword:true})
      }else{
        return null;
      }
  }

}
