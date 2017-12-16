import {Component} from '@angular/core';
import {UserService} from "../user/user.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  message: string = "";

  constructor(private userService: UserService, private router: Router) {
  }

  register(username: string, phoneNumber: string, password: string): boolean {

    this.message = '';

    this.userService.register(username, phoneNumber, password).subscribe(
      loginResponse => {

        console.log("Login response: ", loginResponse);
        if (loginResponse.errorCode == null) {

          console.log("jwt-token: ", loginResponse.user.token);
          localStorage.setItem("token", loginResponse.user.token);
          localStorage.setItem("msisdn", loginResponse.user.phoneNumber);
          this.router.navigate(['']);
        }
        else {
          const errMsg = loginResponse.errorCode;

          if (errMsg === "INVALID_MSISDN")
            this.message = "Invalid msisdn";
          else if (errMsg === "INVALID_USERNAME")
            this.message = "Invalid username";
          else if (errMsg === "INVALID_PASSWORD")
            this.message = "You must enter password";
          else if (errMsg === "USER_ALREADY_EXISTS")
            this.message = "User with that phone number already registered";
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
