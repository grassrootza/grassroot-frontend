import {Component} from '@angular/core';
import {UserService} from "./user/user.service";
import {NavigationEnd, Router} from "@angular/router";
import {User} from "./user/user.model";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {

  loggedInUser: User = null;
  currentUrl = "";

  constructor(private router: Router, private userService: UserService) {

    this.router.events.subscribe(ev => {
      console.log("Router event: ", ev);
      if (ev instanceof NavigationEnd)
        this.currentUrl = ev.url;
    });

    this.userService.loggedInUser.subscribe(user => this.loggedInUser = user);

  }



}


