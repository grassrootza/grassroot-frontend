import {Injectable} from '@angular/core';
import {environment} from "environments/environment";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Notification} from "./model/notification.model";
import {LocalStorageService, STORE_KEYS} from "../utils/local-storage.service";

@Injectable()
export class NotificationService {

  private unreadNotificationsUrl = environment.backendAppUrl + "/api/user/notifications";

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {
  }

  fetchUnreadNotifications(): Observable<Notification[]> {
    const fullUrl = this.unreadNotificationsUrl + "/list";
    return this.httpClient.get<Notification[]>(fullUrl)
      .map(ntfs => ntfs.map(ntf => Notification.transformDates(ntf)));
  }

  markNotificationRead(notificationUid: string): Observable<any> {
    const fullUrl = this.unreadNotificationsUrl + "/mark-read";
    const params = new HttpParams().set("notificationUid", notificationUid);
    const currentCache = this.localStorageService.getItem(STORE_KEYS.DISPLAYED_NOTIFICATIONS_STORAGE_KEY);
    return this.httpClient.get<any>(fullUrl, {params: params}).map(response => {
      if (currentCache) {
        const remKeys = currentCache.split(';');
        const index = remKeys.indexOf(notificationUid, 0);
        if (index > -1) {
          remKeys.splice(index, 1);
          this.localStorageService.setItem(STORE_KEYS.DISPLAYED_NOTIFICATIONS_STORAGE_KEY, remKeys.join(";"));
        }
      }
      return response;
    });
  }

  markAllNotificationsAsRead(): Observable<any> {
    const fullUrl = this.unreadNotificationsUrl + "/mark-read/all";
    return this.httpClient.get<any>(fullUrl).map(response => {
      this.localStorageService.removeItem(STORE_KEYS.DISPLAYED_NOTIFICATIONS_STORAGE_KEY);
      return response;
    });
  }

}
