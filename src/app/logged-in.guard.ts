import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from "./user/user.service";

@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {

    console.log("calling logged in guard");

    const isLoggedIn = this.userService.isLoggedIn();

    let afterLoginUrl = state.url;
    if (afterLoginUrl.indexOf('?') > -1)
      afterLoginUrl = afterLoginUrl.substring(0, afterLoginUrl.indexOf('?'));

    localStorage.setItem("afterLoginUrl", afterLoginUrl);
    localStorage.setItem("afterLoginParams", JSON.stringify(next.queryParams));

    if (!isLoggedIn) {
      this.router.navigate(['login']);
    }

    return isLoggedIn;

  }
}
