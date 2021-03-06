import {Component} from '@angular/core';
import {UserService} from "../user/user.service";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {emailOrPhoneEntered, optionalEmailValidator, optionalPhoneValidator} from "../validators/CustomValidators";
import {environment} from "environments/environment";
import {RECAPTCHA_URL} from "../utils/recaptcha.directive";
declare var $: any;

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
  public otpEntered:string = "";

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
    this.registerUser();
    return false;
  }

  registerUser(){
    this.userService.register(this.regForm.get('name').value, this.regForm.get('phone').value,
      this.regForm.get('email').value, this.regForm.get('password').value,this.otpEntered).subscribe(
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
          else if (errMsg === "USER_REGISTRATION_FAILED")
            this.message = "Sorry, registration failed. If you are trying to register with an existing account, try resetting your password.";
          else if(errMsg === "OTP_REQUIRED"){
            $('#reg-otp-modal').modal("show");
          }
          else if (errMsg === "INVALID_OTP")
            this.message = "Error! please enter a valid otp sent to your phone or email.";
          else this.message = "Unknown error: " + errMsg;

          console.log("Registration error!", errMsg);
          setTimeout(() =>{
            this.message = "";
          },2000);
        }
      },
      err => {
        console.log("Registration failed!", err);
      }
    );
  }

  registerWithOtp(otpSend:string){
    this.otpEntered = otpSend;
    this.registerUser();
    $('#reg-otp-modal').modal("hide");
    return false;
  }

}
