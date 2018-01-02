import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../user/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  message: string;

  constructor(public userService: UserService, private router: Router) {
    this.message = '';
  }

  login(username: string, password: string): boolean {

    this.message = '';

    this.userService.login(username, password).subscribe(
      authResponse => {
        console.log("Auth response: ", authResponse);
        if (authResponse.errorCode == null) {
          let afterLoginUrl = localStorage.getItem("beforeLoginUrl");
          if (!afterLoginUrl)
            afterLoginUrl = "groups";
          localStorage.removeItem("beforeLoginUrl");
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
    console.log("Login failed", error);
    this.message = "Login failed. Try again.";
    setTimeout(() => {
      this.message = "";
    }, 2000)
  }
}
