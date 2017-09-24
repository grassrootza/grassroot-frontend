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
      userData => {

        this.router.navigate(['groups']);
      },
      err => {
        console.log(err);
        this.message = "Login failed. Try again.";
        setTimeout(() => {
          this.message = "";
        }, 2000)
      },
      () => console.log('Request Complete')
    );

    return false;
  }

}
