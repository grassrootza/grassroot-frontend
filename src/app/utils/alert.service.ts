import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {NavigationStart, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AlertService {

  // note: only one kind of alert (not doing error alerts - should be more intrusive, or within form)
  private subject = new Subject<string>();
  private keepAfterRouteChange = false;

  constructor(private router: Router, private translate: TranslateService) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart && !this.keepAfterRouteChange)
        this.clear();
    });
  }

  getAlert(): Observable<string> {
    return this.subject.asObservable();
  }

  alert(message: string, keepAfterRouteChange: boolean = false) {
    this.subject.next(message);
    this.keepAfterRouteChange = keepAfterRouteChange;
  }

  clear() {
    this.subject.next();
  }

}
