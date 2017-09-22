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

    if(!isLoggedIn)
      this.router.navigate(['login']);

    return isLoggedIn;

  }
}
