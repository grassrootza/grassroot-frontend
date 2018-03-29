import {Injectable} from "@angular/core";

export const USER_LOGGED_IN_KEY = "grassroot-user-logged-in";

@Injectable()
export class CookiesService {

  // note: these are _only_ for a simple flag recording if user has logged in - and hence where to direct on root
  storeUserLoggedIn() { }
  clearUserLoggedIn() { }
  isUserLoggedIn(): boolean { return false; }

  get(key: string) { }
  put(key: string, value: string) { }

}
