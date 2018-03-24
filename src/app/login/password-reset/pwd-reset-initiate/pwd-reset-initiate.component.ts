import {Component, OnInit} from '@angular/core';
import {PasswordResetService} from "../password-reset.service";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {isValidNumber} from "libphonenumber-js";
import {Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {RECAPTCHA_URL} from "../../../utils/recaptcha.directive";

@Component({
  selector: 'app-pwd-reset-initiate',
  templateUrl: './pwd-reset-initiate.component.html',
  styleUrls: ['./pwd-reset-initiate.component.css', '../password-reset.component.css'],
  providers: [{
    provide: RECAPTCHA_URL,
    useValue: environment.recaptchaVerifyUrl
  }]
})
export class PwdResetInitiateComponent implements OnInit {

  formInitiate: FormGroup;
  username = new FormControl();
  captcha = new FormControl();

  constructor(private passwordService: PasswordResetService, private router: Router,
              private fb: FormBuilder) {
    this.username.setValidators(Validators.required);
    this.username.setValidators(eitherEmailOrPhone);
    this.formInitiate = this.fb.group({
      'username': this.username,
      'captcha': new FormControl()
    });
  }

  ngOnInit() {
  }

  submitUsername() {
    this.passwordService.initiateReset(this.username.value).subscribe(result => {
      // note: we do not disclose if user exists, for security
      this.router.navigate(['/forgot/validate']);
    }, error => {
      this.router.navigate(['/forgot/validate']);
    });
  }

}

export const eitherEmailOrPhone = (control: AbstractControl) => {
  let mailFormat = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|([0-9]{10})+$/;

  let inputStr = control.value;
  let isEmail = mailFormat.test(inputStr);

  if (!isEmail) {
    if (!isValidNumber({ phone: inputStr, country: 'ZA' })) {
      return { validEmailOrPhone: true }
    }
  }

  return null;
};
