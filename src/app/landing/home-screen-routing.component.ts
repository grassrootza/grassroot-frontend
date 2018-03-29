import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Router} from "@angular/router";
import {AlertService} from "../utils/alert-service/alert.service";
import {isPlatformBrowser} from "@angular/common";
import {UserService} from "../user/user.service";
import {CookiesService} from "../utils/cookie-service/cookies.service";

@Component({
  selector:    'home-screen-routing',
  templateUrl: './home-screen-routing.component.html'
})
export class HomeScreenRoutingComponent implements OnInit {

  isLoggedIn: boolean = false;

  public constructor(public alertService: AlertService,
                     public cookieService: CookiesService,
                     public userService: UserService,
                     public router: Router,
                     @Inject(PLATFORM_ID) protected platformId: Object) {
    console.log("are we logged in? : ", this.cookieService.isUserLoggedIn());
    this.isLoggedIn = this.cookieService.isUserLoggedIn();
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.alertService.showLoading();
      if (isPlatformBrowser(this.platformId)) {
        this.router.navigate(['home']);
      }
    }
  }

}
