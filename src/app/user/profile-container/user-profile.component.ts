import {AfterViewInit, Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {NavigationEnd, Router} from "@angular/router";
import {AlertService} from "../../utils/alert-service/alert.service";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, AfterViewInit {

  public currentTab: string = "profile";
  public showAccountSettings: boolean = false;

  constructor(private userService: UserService, private router: Router, private alertService: AlertService) {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        let uri = ev.urlAfterRedirects;
        this.currentTab = uri.substring(uri.lastIndexOf("/") + 1);
      }
    });

    this.showAccountSettings = this.userService.getLoggedInUser().hasAccountAdmin();
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.alertService.hideLoadingDelayed();
  }

  logout() {
    this.userService.logout(false);
    return false;
  }

}
