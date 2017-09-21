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
      data => {
        let jsonData = data.json();
        console.log("Login response: " , jsonData);
        const token = jsonData.data.token;
        const msisdn = jsonData.data.msisdn;
        console.log("jwt-token: ", token);
        localStorage.setItem("token", token);
        localStorage.setItem("msisdn", msisdn);
        this.router.navigate(['']);
      },
      err => {
        console.log(err);
        this.message = "Invalid username / password";
        setTimeout(() => {
          this.message = "";
        }, 2000)
      },
      () => console.log('Request Complete')
    );

    return false;
  }

}
