import {Injectable} from "@angular/core";
import {CookiesService} from "./cookies.service";
import {CookieService} from "ngx-cookie";

@Injectable()
export class BrowserCookiesService extends CookiesService {

  constructor(private _cookieService: CookieService) {
    super();
  }

  public get(key: string) {
    return this._cookieService.get(key);
  }

  public put(key: string, value: string) {
    this._cookieService.put(key, value); // todo : security, options, etc.
  }
}
