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
    console.log('canActivate', isLoggedIn);

    // todo: figure out how to preserve params, because we need them on incoming requests. major.
    // note absolutely nothing below is having any effect whatsoever. can't find a way to do this. giving up.
    console.log("query params: ", next.parent.queryParams);

    if(!isLoggedIn)
      this.router.navigate(['login'], {
        queryParams: next.parent.queryParams,
        preserveQueryParams: true,
        queryParamsHandling: "merge"
      });

    return isLoggedIn;

  }
}
