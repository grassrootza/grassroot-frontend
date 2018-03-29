import {Injectable} from "@angular/core";
import {CookiesService, USER_LOGGED_IN_KEY} from "./cookies.service";
import {CookieService} from "ngx-cookie";

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

  public get(key: string) {
    return this._cookieService.get(key);
  }

  public put(key: string, value: string) {
    this._cookieService.put(key, value); // todo : security, options, etc.
  }
}
