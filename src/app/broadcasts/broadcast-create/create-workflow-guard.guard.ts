import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {BroadcastService} from "../broadcast.service";

@Injectable()
export class BroadcastWorkflowGuard implements CanActivate {

  constructor(private broadcastService: BroadcastService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.verifyWorkFlow(next.routeConfig.path);
  }

  verifyWorkFlow(path): boolean {
    let firstPath = this.broadcastService.firstInvalidPath();
    if (firstPath.length > 0 && firstPath != path) {
      this.router.navigate([this.broadcastService.routeUrl(firstPath)]);
      return false;
    }
    return true;
  }
}
