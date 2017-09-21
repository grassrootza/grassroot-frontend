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
      data => {
        let jsonData = data.json();
        console.log("Login response: ", jsonData);
        const token = jsonData.data.token;
        const msisdn = jsonData.data.msisdn;
        console.log("jwt-token: ", token);
        localStorage.setItem("token", token);
        localStorage.setItem("msisdn", msisdn);
        this.router.navigate(['']);
      },
      err => {

        const errMsg = err.json().message;

        if (errMsg === "INVALID_MSISDN")
          this.message = "Invalid msisdn";
        else if (errMsg === "INVALID_USERNAME")
          this.message = "Invalid username";
        else if (errMsg === "INVALID_PASSWORD")
          this.message = "You must enter password";
        else if (errMsg === "USER_ALREADY_EXISTS")
          this.message = "User with that phone number already registered";


        else this.message = "Unknown error: " + errMsg;

        console.log(err.json().message);

      },
      () => console.log('Request Complete')
    );
    return false;
  }


}
