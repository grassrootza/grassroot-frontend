import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../user/user.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {eitherEmailOrPhoneValid} from "../utils/CustomValidators";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  message: string;
  loginForm:FormGroup;

  showForceLogoutReason = false;

  constructor(public userService: UserService, private router: Router, private translate: TranslateService) {
    this.message = '';
    this.loginForm = new FormGroup({
        username: new FormControl('',[Validators.required, Validators.minLength(3), eitherEmailOrPhoneValid]),
        password:new FormControl('',Validators.required)
    }, { updateOn: 'blur' });
    this.showForceLogoutReason = this.userService.showForceLogoutReason;
  }

  login(username: string, password: string): boolean {

    console.log("username received: ", username);
    this.message = '';

    this.userService.login(username, password).subscribe(
      authResponse => {
        console.log("Auth response: ", authResponse);
        if (authResponse.errorCode == null) {
          let afterLoginUrl = localStorage.getItem("afterLoginUrl");
          if (!afterLoginUrl)
            afterLoginUrl = "/";

          let afterLoginParams = localStorage.getItem("afterLoginParams");
          localStorage.removeItem("afterLoginUrl");
          localStorage.removeItem("afterLoginParams");

          if (afterLoginParams)
            this.router.navigate([afterLoginUrl], {queryParams: JSON.parse(afterLoginParams)});
          else
            this.router.navigate([afterLoginUrl]);
        }
        else {
          this.handleLoginError(authResponse.errorCode);
        }
      },
      err => {
        this.handleLoginError(err.toString());
      }
    );

    return false;
  }

  private handleLoginError(error: string) {
    this.translate.get("login.error-message").subscribe(msg => this.message = msg);
    setTimeout(() => {
      this.message = "";
    }, 2000)
  }
}
