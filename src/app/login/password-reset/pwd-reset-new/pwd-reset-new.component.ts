import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PasswordResetService} from "../password-reset.service";
import {AlertService} from "../../../utils/alert-service/alert.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pwd-reset-new',
  templateUrl: './pwd-reset-new.component.html',
  styleUrls: ['./pwd-reset-new.component.css', '../password-reset.component.css']
})
export class PwdResetNewComponent implements OnInit {

  pwdGroup: FormGroup;

  constructor(private passwordService: PasswordResetService,
              private alertService: AlertService,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.pwdGroup = this.formBuilder.group({
      pwd_new: ['', Validators.required],
      pwd_confirm: ['', Validators.required]
    }, { validator: comparePasswords });
  }

  ngOnInit() {
  }

  completeReset() {
    if (this.pwdGroup.valid) {
      this.passwordService.completeReset(this.pwdGroup.get('pwd_new').value).subscribe(complete => {
        if (complete) {
          this.alertService.alert('reset.new.complete', true);
          this.router.navigate(['/login']);
        } else {
          this.alertService.alert('reset.new.server_error', true);
          this.router.navigate(['/login']); // maybe back to start of password reset?
        }
      })
    }
  }

}

export const comparePasswords = (control:AbstractControl) => {
  let password = control.get('pwd_new').value;
  let confirmPassword = control.get('pwd_confirm').value;

  if (password != confirmPassword){
    return { passwordMismatch: true };
  }

  return null;
};
