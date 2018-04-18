import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {UserService} from "./user/user.service";
import {Router} from "@angular/router";
import {AuthenticatedUser} from "./user/user.model";
import {TranslateService} from '@ngx-translate/core';
import {AlertService} from "./utils/alert-service/alert.service";
import {NotificationService} from "./user/notification.service";
import {Notification} from "./user/model/notification.model";
import {LocalStorageService, STORE_KEYS} from "./utils/local-storage.service";
import {isPlatformBrowser} from "@angular/common";

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  isUserLoggedIn: boolean = false;
  loggedInUser: AuthenticatedUser = null;
  alertMessage: string = "";
  currentUrl = "";

  notifications: Notification[] = [];

  popupNotification: Notification = null;

  loadingModule: boolean = false;

  private newNotifications: Notification[] = [];
  private currentPopupNotificationIndex = 0;
  private popopNotificationTimeoutId: any = null;
  private popupNotificationEngaged = false;
  private popupNotificationDisplayInProgress = false;

  private maxNumberOfPopupNotificationInSequence = 3;

  public userImageUrl;
  public userHasNoImage: boolean; // seems redundant but Angular being insanely obtuse on chnages

  public showMenu: boolean = false;

  constructor(private router: Router,
              private userService: UserService,
              private translateService: TranslateService,
              private alertService: AlertService,
              private notificationService: NotificationService,
              private localStorageService: LocalStorageService,
              @Inject(PLATFORM_ID) protected platformId: Object) {

    this.loggedInUser = this.userService.getLoggedInUser();
    if (this.loggedInUser && this.loggedInUser.hasImage) {
      this.userImageUrl = this.userService.getProfileImageUrl(false);
    } else {
      this.userImageUrl = '';
      this.userHasNoImage = true;
    }

    // this.router.events.subscribe(ev => {
    //   if (ev instanceof RouteConfigLoadStart) {
    //     console.log("start routing to lazy module, navigating");
    //     this.loadingModule = true;
    //   }
    //
    //   if (ev instanceof NavigationEnd) {
    //     console.log("navigation has ended");
    //     this.currentUrl = ev.url;
    //   }
    // });

    this.userService.loggedInUser.subscribe(user => {
      // console.log("user emitted!");
      this.loggedInUser = user;
      this.userHasNoImage = !this.loggedInUser || !this.loggedInUser.hasImage;
      // console.log("user has no image? : ", this.userHasNoImage);
      if (this.loggedInUser && this.loggedInUser.hasImage) {
        this.userImageUrl = this.userService.getProfileImageUrl(true);
      }
    });

    this.alertService.getAlert().subscribe(message=> {
      this.alertMessage = message;
    });

    this.alertService.loading.subscribe(loading => {
      this.loadingModule = loading;
    });

    translateService.addLangs(['en']);
    translateService.setDefaultLang('en');

    if (isPlatformBrowser(this.platformId)) {
      const browserLang = translateService.getBrowserLang();
      translateService.use(browserLang.match(/en/) ? browserLang : 'en');
    } else {
      translateService.use('en');
    }
  }

  ngOnInit(): void {
    // console.log("is the user logged in? ", this.userService.isLoggedIn());
    if (isPlatformBrowser(this.platformId) && this.userService.isLoggedIn()) {
      $(".ntf-popup").hide();
      this.pullNotifications();
      setInterval(() => {
        this.pullNotifications()
      }, 10000);
    }
  }

  public navigateToMainLink(route: string) {
    this.router.navigate([route]);
    this.showMenu = false;
  }

  public toggleMenuCollapse() {
    this.showMenu = !this.showMenu;
  }

  private pullNotifications() {

    if (!this.userService.isLoggedIn())
      return;

    if (this.popupNotificationEngaged || this.popupNotificationDisplayInProgress) {
      console.log("Skipping notifications pull, popupNotificationEngaged: " + this.popupNotificationEngaged + ", popupNotificationDisplayInProgress: " + this.popupNotificationDisplayInProgress);
      return;
    }

    this.notificationService.fetchUnreadNotifications().subscribe(notifications => {
          let displayedNotifications: string = this.localStorageService.getItem(STORE_KEYS.DISPLAYED_NOTIFICATIONS_STORAGE_KEY);
          if (!displayedNotifications)
            displayedNotifications = "";

          this.newNotifications = notifications.filter(nn => displayedNotifications.indexOf(nn.uid) == -1);
          this.notifications = notifications;
          if (this.newNotifications.length > 0) {
            this.currentPopupNotificationIndex = 0;
            this.showNextNewNotification();
          }

          else this.popupNotification = null;
        },
        error => {
          if (error.status == 401)
            this.userService.logout(true, '/login');
          else console.log("Notifications error: ", error);
        }

      );
  }

  showNextNewNotification() {
    if (this.newNotifications.length > this.currentPopupNotificationIndex && this.currentPopupNotificationIndex < this.maxNumberOfPopupNotificationInSequence) {
      this.popupNotificationDisplayInProgress = true;
      this.popupNotification = this.newNotifications[this.currentPopupNotificationIndex];

      $(".ntf-popup").fadeIn(500);
      this.popopNotificationTimeoutId = setTimeout(() => {
        this.hidePopupNotification()
      }, 4000);


      let displayedNotifications: string = this.localStorageService.getItem(STORE_KEYS.DISPLAYED_NOTIFICATIONS_STORAGE_KEY);
      displayedNotifications = displayedNotifications ? displayedNotifications : "";
      displayedNotifications = displayedNotifications + ";" + this.popupNotification.uid;
      this.localStorageService.setItem(STORE_KEYS.DISPLAYED_NOTIFICATIONS_STORAGE_KEY, displayedNotifications);

      this.currentPopupNotificationIndex++;
    }
    else {
      this.popupNotificationDisplayInProgress = false;
      this.popupNotificationEngaged = false;
    }
  }

  popupNotificationMouseEnter() {
    this.popupNotificationEngaged = true;
    clearTimeout(this.popopNotificationTimeoutId)
  }

  popupNotificationMouseExit() {
    this.popupNotificationEngaged = false;
    this.hidePopupNotification()
  }

  hidePopupNotification() {
    $(".ntf-popup").fadeOut(500, function () {
      this.showNextNewNotification();
    }.bind(this));
  }

  logout() {
    this.userService.logout(false);
    // note: with path based routing for some reason need to call this
    return false;
  }

  clearAlert() {
    this.alertMessage = "";
  }


  handleNotificationClick(event: any, notificationUid: string) {
    event.stopPropagation();
    this.markNotificationRead(notificationUid);
    return false;
  }

  markNotificationRead(notificationUid: string): boolean {
    this.notificationService.markNotificationRead(notificationUid).subscribe(successResponse => {
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

  markAllNotificationsRead(): boolean {
    this.notificationService.markAllNotificationsAsRead().subscribe(response => {
      console.log("all notifications marked read", response);
      this.notifications = [];
    }, error => console.log("Mark all read failed", error));
    return false;
  }
  
  goToNews(){
    this.router.navigate(['/news',0])
  }


}


