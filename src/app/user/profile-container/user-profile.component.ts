import {Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  public currentTab: string = "profile";

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        let uri = ev.urlAfterRedirects;
        this.currentTab = uri.substring(uri.lastIndexOf("/") + 1);
      }
    });
  }

  logout() {
    this.userService.logout();
    return false;
  }

}
