import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from "../user/user.service";

@Injectable()
export class AdminRoleGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {

    const isLoggedIn = this.userService.isLoggedIn();

    if (!isLoggedIn) {
      this.router.navigate(['login']);
    }

    let roles = next.data['roles'] as Array<string>;
    let userRoles = this.userService.getLoggedInUser().systemRoles;

    return roles.every(role => userRoles.indexOf(role) != -1);

  }
}
