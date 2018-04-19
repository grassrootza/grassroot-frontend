import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

export const STORE_KEYS = {
  NEW_MEMBERS_DATA_CACHE: "NEW_MEMBERS_DATA_CACHE",
  MY_GROUPS_DATA_CACHE: "MY_GROUPS_DATA_CACHE",
  MY_AGENDA_DATA_CACHE: "MY_AGENDA_DATA_CACHE",
  DISPLAYED_NOTIFICATIONS_STORAGE_KEY:  "displayedNotifications"
}

@Injectable()
export class LocalStorageService {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) { }

  setItem(key: string, value: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): any {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem(key) : undefined;
  }

  removeItem(key: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(key);
    }
  }

  clearCaches() {
    if (isPlatformBrowser(this.platformId)) {
      Object.keys(STORE_KEYS).forEach(key => localStorage.removeItem(STORE_KEYS[key]));
    } 
  }

}
