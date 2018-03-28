import {AfterViewInit, Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../user/user.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {eitherEmailOrPhoneValid} from "../validators/CustomValidators";
import {TranslateService} from "@ngx-translate/core";
import {AlertService} from "../utils/alert-service/alert.service";
import {LocalStorageService} from "../utils/local-storage.service";
import {CookiesService} from "../utils/cookie-service/cookies.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements AfterViewInit {

  message: string;
  loginForm:FormGroup;

  showForceLogoutReason = false;

  constructor(public userService: UserService, private router: Router, private translate: TranslateService,
              private alertService: AlertService, private localStorageService: LocalStorageService, private cookieService: CookiesService) {
    this.message = '';
    this.loginForm = new FormGroup({
        username: new FormControl('',[Validators.required, Validators.minLength(3), eitherEmailOrPhoneValid]),
        password:new FormControl('',Validators.required)});
    this.showForceLogoutReason = this.userService.showForceLogoutReason;
    console.log("getting : ", this.cookieService.get("grassroot-logged-in"));
  }

  ngAfterViewInit() {
    this.alertService.hideLoadingDelayed();
  }

  login(username: string, password: string): boolean {

    console.log("username received: ", username);
    this.message = '';

    this.userService.login(username, password).subscribe(
      authResponse => {
        console.log("Auth response: ", authResponse);
        if (authResponse.errorCode == null) {
          let afterLoginUrl = this.localStorageService.getItem("afterLoginUrl");
          if (!afterLoginUrl)
            afterLoginUrl = "/home";

          let afterLoginParams = this.localStorageService.getItem("afterLoginParams");
          this.localStorageService.removeItem("afterLoginUrl");
          this.localStorageService.removeItem("afterLoginParams");

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
