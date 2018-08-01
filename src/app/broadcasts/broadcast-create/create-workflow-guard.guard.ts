import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {BroadcastService} from "../broadcast.service";

@Injectable()
export class BroadcastWorkflowGuard implements CanActivate {

  constructor(private broadcastService: BroadcastService) {
  }

  private steps = ["types", "content", "members", "schedule"];

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // console.log("calling broadcast workflow guard, latest step = ", this.broadcastService.latestStep);
    return this.steps.indexOf(next.routeConfig.path) < this.broadcastService.latestStep;
  }

}
