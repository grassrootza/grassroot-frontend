import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {UserService} from "./user/user.service";

@Injectable()
export class LoggedInGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {


    const isLoggedIn = this.userService.isLoggedIn();
    console.log('canActivate', isLoggedIn, "state: ", state, "next:", next);

    let afterLoginUrl = state.url;
    if (afterLoginUrl.indexOf('?') > -1)
      afterLoginUrl = afterLoginUrl.substring(0, afterLoginUrl.indexOf('?'));

    console.log("afterLoginUrl", afterLoginUrl);
    console.log("afterLoginParams", next.queryParams.toString());
    localStorage.setItem("afterLoginUrl", afterLoginUrl);
    localStorage.setItem("afterLoginParams", JSON.stringify(next.queryParams));

    if (!isLoggedIn) {
      this.router.navigate(['login']);
    }

    return isLoggedIn;

  }
}
