import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  message: string;

  constructor(public authService: AuthService, private router: Router) {
    this.message = '';
  }


  login(username: string, password: string): boolean {

    this.message = '';

    this.authService.login(username, password).subscribe(
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
        this.message = "Invalid username / password"
      },
      () => console.log('Request Complete')
    );


    return false;
  }


  logout(): boolean {
    this.authService.logout();
    return false;
  }


}
