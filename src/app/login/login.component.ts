import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../user/user.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {requirePhoneNumberOrEmail} from "../validators/requirePhoneNumberOrEmail";
import {NumberValidator} from "../validators/NumberValidator";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  message: string;
  loginForm:FormGroup;

  constructor(public userService: UserService, private router: Router) {
    this.message = '';
    this.loginForm = new FormGroup({
        username: new FormControl('',[Validators.required,requirePhoneNumberOrEmail,NumberValidator.numberValidator]),
        password:new FormControl('',Validators.required)
    });
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

  // todo: rather use i18n message
  private handleLoginError(error: string) {
    console.log("Login failed", error);
    this.message = "Login failed. Try again.";
    setTimeout(() => {
      this.message = "";
    }, 2000)
  }
}
