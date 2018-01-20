import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Notification} from "./model/notification.model";

@Injectable()
export class NotificationService {

  private unreadNotificationsUrl = environment.backendAppUrl + "/api/user/notifications";

  constructor(private httpClient: HttpClient) {
  }

  fetchUnreadNotifications(): Observable<Notification[]> {
    const fullUrl = this.unreadNotificationsUrl + "/list";
    return this.httpClient.get<Notification[]>(fullUrl)
      .map(ntfs => ntfs.map(ntf => Notification.transformDates(ntf)));
  }

  markNotificationRead(notificationUid: string): Observable<any> {
    const fullUrl = this.unreadNotificationsUrl + "/mark-read";
    const params = new HttpParams()
      .set("notificationUid", notificationUid);
    return this.httpClient.get<any>(fullUrl, {params: params})
  }

}
