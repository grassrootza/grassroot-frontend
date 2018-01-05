import {Component} from '@angular/core';
import {UserService} from "./user/user.service";
import {NavigationEnd, Router} from "@angular/router";
import {AuthenticatedUser} from "./user/user.model";
import {environment} from "../environments/environment";
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


// todo : general - UI - make use of upper case letters in titles consistent throughout
export class AppComponent {

  loggedInUser: AuthenticatedUser = null;

  currentUrl = "";

  public loggedInUserImageUrl = environment.backendAppUrl + "/api/user/profile/image/view";

  constructor(private router: Router,
              private userService: UserService,
              private translateService: TranslateService
  ) {

    this.loggedInUser = this.userService.getLoggedInUser();

    if (this.loggedInUser == null)
      this.router.navigate(['/login']);

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd)
        this.currentUrl = ev.url;
    });

    this.userService.loggedInUser.subscribe(user => {
      console.log("user emitted!");
      this.loggedInUser = user
    });

    translateService.addLangs(['en']);
    translateService.setDefaultLang('en');
    const browserLang = translateService.getBrowserLang();
    translateService.use(browserLang.match(/en/) ? browserLang : 'en');
  }

  logout() {
    this.userService.logout();
    // note: with path based routing for some reason need to call this
    return false;
  }



}


