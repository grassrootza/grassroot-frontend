import {Injectable, isDevMode} from "@angular/core";
import {CookiesService, USER_LOGGED_IN_KEY} from "./cookies.service";
import {CookieService} from "ngx-cookie";

import * as moment from 'moment';

@Injectable()
export class BrowserCookiesService extends CookiesService {

  constructor(private _cookieService: CookieService) {
    super();
  }

  storeUserLoggedIn() {
    this.put(USER_LOGGED_IN_KEY, "" + true);
  }

  clearUserLoggedIn() {
    this._cookieService.remove(USER_LOGGED_IN_KEY);
  }

  isUserLoggedIn(): boolean {
    return !!this.get(USER_LOGGED_IN_KEY);
  }

  private get(key: string) {
    return this._cookieService.get(key);
  }

  // note: this must be kept private because the _only_ use for it is the methods above, which do not contain the session
  private put(key: string, value: string) {
    let expiry = moment().add(7, 'days').toDate();
    let cookieOptions = isDevMode() ?
      { secure : false, expiry: expiry } :
      { secure : true, expiry: expiry };
    this._cookieService.put(key, value, cookieOptions);
  }
}
