import {Component, OnInit} from '@angular/core';
import {UserService} from "./user/user.service";
import {NavigationEnd, Router} from "@angular/router";
import {AuthenticatedUser} from "./user/user.model";
import {environment} from "../environments/environment";
import {TranslateService} from '@ngx-translate/core';
import {AlertService} from "./utils/alert.service";
import {NotificationService} from "./user/notification.service";
import {Notification} from "./user/model/notification.model";

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {

  loggedInUser: AuthenticatedUser = null;
  alertMessage: string = "";

  notifications: Notification[] = [];

  popupNotification: Notification = null;

  newNotifications: Notification[] = [];

  currentPopupNotificationIndex = 0;

  currentUrl = "";
  popopNotificationTimeoutId: any = null;
  popupNotificationEngaged = false;
  popupNotificationDisplayInProgress = false;

  maxNumberOfPopupNotificationInRole = 3;


  public loggedInUserImageUrl = environment.backendAppUrl + "/api/user/profile/image/view";

  constructor(private router: Router,
              private userService: UserService,
              private translateService: TranslateService,
              private alertService: AlertService,
              private notificationService: NotificationService) {

    this.loggedInUser = this.userService.getLoggedInUser();

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd)
        this.currentUrl = ev.url;
    });

    this.userService.loggedInUser.subscribe(user => {
      console.log("user emitted!");
      this.loggedInUser = user
    });

    this.alertService.getAlert().subscribe(message=> {
      // todo : fade it out?
      this.alertMessage = message;
    });

    translateService.addLangs(['en']);
    translateService.setDefaultLang('en');
    const browserLang = translateService.getBrowserLang();
    translateService.use(browserLang.match(/en/) ? browserLang : 'en');
  }

  ngOnInit(): void {

    $(".ntf-popup").hide();
    this.pullNotifications();
    setInterval(() => {
      this.pullNotifications()
    }, 10000);
  }

  private pullNotifications() {

    if (this.popupNotificationEngaged || this.popupNotificationDisplayInProgress) {
      console.log("Skipping notifications pull, popupNotificationEngaged: " + this.popupNotificationEngaged + ", popupNotificationDisplayInProgress: " + this.popupNotificationDisplayInProgress);
      return;
    }

    this.notificationService.fetchUnreadNotifications()
      .subscribe(
        notifications => {
          console.log("Notifications: ", notifications);
          this.newNotifications = notifications.filter(nn => !this.notifications.find(old => old.uid == nn.uid));
          this.notifications = notifications;
          if (this.newNotifications.length > 0) {
            this.currentPopupNotificationIndex = 0;
            this.showNextNewNotification();
          }

          else this.popupNotification = null;
        },
        error => {
          console.log("Notifications error: ", error);
        }
      );
  }

  showNextNewNotification() {
    if (this.newNotifications.length > this.currentPopupNotificationIndex && this.currentPopupNotificationIndex < this.maxNumberOfPopupNotificationInRole) {
      this.popupNotificationDisplayInProgress = true;
      console.log("Showing popup ntf " + this.currentPopupNotificationIndex);
      this.popupNotification = this.newNotifications[this.currentPopupNotificationIndex];
      $(".ntf-popup").fadeIn(500);
      this.popopNotificationTimeoutId = setTimeout(() => {
        this.hidePopupNotification()
      }, 4000);
      this.currentPopupNotificationIndex++;
    }
    else {
      this.popupNotificationDisplayInProgress = false;
      this.popupNotificationEngaged = false;
    }
  }

  popupNotificationMouseEnter() {
    console.log("Mouse enter popup notification");
    this.popupNotificationEngaged = true;
    clearTimeout(this.popopNotificationTimeoutId)
  }

  popupNotificationMouseExit() {
    console.log("Mouse exit popup notification");
    this.popupNotificationEngaged = false;
    this.hidePopupNotification()
  }

  hidePopupNotification() {
    $(".ntf-popup").fadeOut(500, function () {
      this.showNextNewNotification();
    }.bind(this));
  }

  logout() {
    this.userService.logout();
    // note: with path based routing for some reason need to call this
    return false;
  }

  clearAlert() {
    this.alertMessage = "";
  }


  handleNotificationClick(event: any) {
    event.stopPropagation();
    return false;
  }

  markNotificationRead(notificationUid: string): boolean {
    this.notificationService.markNotificationRead(notificationUid)
      .subscribe(
        successResponse => {
          console.log("Mark notification result: ", successResponse);
          //remove notification with this uid, since it's no longed unread
          this.notifications = this.notifications.filter(ntf => ntf.uid != notificationUid);
          this.popupNotificationEngaged = false;
          this.hidePopupNotification()
        },
        error => console.log("Mark notification failed!", error)
      );

    return false;
  }


}


