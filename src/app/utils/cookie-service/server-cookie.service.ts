import {Inject, Injectable, Optional, PLATFORM_ID} from "@angular/core";
import {REQUEST} from "@nguniversal/express-engine/tokens";
import {Request} from 'express';
import {isPlatformServer} from "@angular/common";
import {CookiesService} from "./cookies.service";

@Injectable()
export class ServerCookieService extends CookiesService {

  cookieStore: {};

  constructor(@Inject(PLATFORM_ID) protected platformId: Object, @Inject(REQUEST) @Optional() private request: Request) {
    super();
    if (isPlatformServer(platformId) && this.request != null) {
      console.log("request not null, looks like on server!, request: ", request.headers.cookie);
      this.parseCookies(this.request.headers.cookie);
    }
    console.log("should be done getting cookies, here is store: ", this.cookieStore);
  }

  public parseCookies(cookies) {
    this.cookieStore = {};
    if (!!cookies === false) { return; }
    let cookiesArr = cookies.split(';');
    for (const cookie of cookiesArr) {
      const cookieArr = cookie.split('=');
      this.cookieStore[cookieArr[0].trim()] = cookieArr[1].trim();
    }
  }

  public get(key: string) {
    console.log("cookie store: ", this.cookieStore);
    console.log("key: ", key);
    console.log("store with key: ", this.cookieStore[key]);
    return !!this.cookieStore[key] ? this.cookieStore[key] : null;
  }

  public put(key: string, value: string) {
    // transition, once proper module is worked out
    console.log("SHOULD NOT BE PUTTING COOKIES VIA SERVER MODULE, YET");
  }

}
