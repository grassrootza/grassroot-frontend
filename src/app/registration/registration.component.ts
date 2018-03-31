import {Component} from '@angular/core';
import {UserService} from "../user/user.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {emailOrPhoneEntered, optionalEmailValidator, optionalPhoneValidator} from "../validators/CustomValidators";
import {environment} from "../../environments/environment";
import {RECAPTCHA_URL} from "../utils/recaptcha.directive";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [{
    provide: RECAPTCHA_URL,
    useValue: environment.recaptchaVerifyUrl
  }]
})
export class RegistrationComponent {

  message: string = "";
  regForm: FormGroup;

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) {
    this.regForm = fb.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      phone: ['', optionalPhoneValidator],
      email: ['', optionalEmailValidator],
      password: ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      captcha: new FormControl()
    }, { validator: emailOrPhoneEntered("email", "phone") })
  }

  register(): boolean {
    this.message = '';

    this.userService.register(this.regForm.get('name').value, this.regForm.get('phone').value,
      this.regForm.get('email').value, this.regForm.get('password').value).subscribe(
      loginResponse => {
        console.log("Login response: ", loginResponse);
        if (loginResponse.errorCode == null) {
          this.router.navigate(['']);
        }
        else {
          const errMsg = loginResponse.errorCode;

          if (errMsg === "INVALID_MSISDN")
            this.message = "The phone number you entered is invalid";
          else if (errMsg === "INVALID_USERNAME")
            this.message = "Please enter a valid name (without special characters)";
          else if (errMsg === "USER_ALREADY_EXISTS")
            this.message = "A user with that phone number or email already exists";
          else this.message = "Unknown error: " + errMsg;

          console.log("Registration error!", errMsg);
        }
      },
      err => {
        console.log("Registration failed!", err);
      }
    );
    return false;
  }

}
