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

  public loading = new Subject<boolean>();

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
    setTimeout(()=>{
      this.clear();
    },3000); // remove it after 3 seconds
  }

  showLoading() {
    this.loading.next(true);
  }

  hideLoading() {
    this.loading.next(false);
  }

  hideLoadingDelayed() {
    setTimeout(() => this.hideLoading(), 300);
  }

  clear() {
    this.subject.next();
  }

}
