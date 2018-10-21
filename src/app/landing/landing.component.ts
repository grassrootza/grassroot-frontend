import {animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style} from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {Subscription, interval } from 'rxjs';
import {PublicActivityType} from './model/public-activity-type.enum';
import {PublicActivity} from './model/public-activity.model';
import {PublicActivityService} from './public-activity.service';
import {PublicNewsService} from './public-news.service';
import {AlertService} from "../utils/alert-service/alert.service";
import {isPlatformBrowser} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {PublicLivewire} from "../livewire/public-livewire.model";

declare var $: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: [ './landing.component.css', './news-style.css' ]
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tasknote') carouselPlaceHolder: ElementRef;
  @ViewChild('activitiesRow') activitiesRow: ElementRef;
  @ViewChild('activitiesPlaceHolder') activitiesPlaceHolder: ElementRef;

  public activitiesList: PublicActivity[] = [];
  public newsList: PublicLivewire[] = [];

  public readonly lowResImagePath = '/assets/landing/banner_bg1.jpg';
  public readonly highResImagePath = '/assets/landing/banner_bg.jpg';

  private activitiesPoller: Subscription;
  private newsPoller: Subscription;

  public activitiesHeight: number = 0;

  public anchorPoint: string;
  public viewInited: boolean = false;

  private player: AnimationPlayer;

  public pseudonyms: string[] = [];



  constructor(private alertService: AlertService,
              private publicActivityService: PublicActivityService,
              private publicNewsService: PublicNewsService,
              private cdr: ChangeDetectorRef,
              private builder: AnimationBuilder,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(PLATFORM_ID) protected platformId: Object) {
  }

  ngOnInit() {
    this.alertService.hideLoadingDelayed();

    //load public activity first time component is initialized
    if (isPlatformBrowser(this.platformId)) {
      this.publicActivityService.loadLastFiveActivities()
        .subscribe(activities => {
          this.activitiesList = activities;

          setTimeout(() => {
            this.activitiesHeight = this.activitiesRow.nativeElement.offsetHeight;
          });
        });

      //load new public activity every half minute after that (30000 ms = 1min), remove this if we dont need to update news when user is on page.
      this.activitiesPoller = interval(30000)
        .subscribe(() => {
          console.log("fetching new public activity ...");
          this.loadPublicActivity();
        });

      //load news first time component is initialized.
      this.loadNews();

      //load news every 2 mins after that (120000 ms = 2min), remove this if we dont need to update news when user is on page.
      this.newsPoller = interval(120000)
        .subscribe(() => {
            this.loadNews();
          }
        );
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    if (this.activitiesPoller)
      this.activitiesPoller.unsubscribe();
    if (this.newsPoller)
      this.newsPoller.unsubscribe();
  }

  navigateTo(route: string, fragment?: string) {
    if (fragment) {
      this.router.navigate([route], { fragment: fragment });
    } else {
      this.router.navigate([route]);
    }
    return false;
  }

  loadPublicActivity() {
    this.publicActivityService.loadLastFiveActivities().subscribe(activities => {
        console.log(activities);
        const numberOfNewActivities = this.getNumberOfNewActivities(activities);
        if (numberOfNewActivities > 0) {
          this.playActivitiesAnimation(numberOfNewActivities, activities);
        }
      });
  }

  getNumberOfNewActivities(newActivities: PublicActivity[]): number {
    const numberActivites = newActivities.map(activity => {
      let index = this.activitiesList.findIndex(existing => existing.equals(activity));
      return index == -1 ? 1 : 0
    }).reduce((a, b) => a + b, 0);

    console.log('number new activities: ', numberActivites);
    return numberActivites;
  }

  private playActivitiesAnimation(numberOfNewActivities: number, newActivities: PublicActivity[]): void {
    console.log(numberOfNewActivities);
    let activitiesPlaceholder = this.activitiesPlaceHolder.nativeElement;

    const myAnimation: AnimationFactory = this.buildAnimationDown(numberOfNewActivities * this.activitiesHeight);
    for (let i = activitiesPlaceholder.children.length - 1; i >= 0; i--) {
      this.player = myAnimation.create(activitiesPlaceholder.children[ i ]);
      this.player.play();
      if (i == 0) {
        this.player.onDone(() => {
          this.activitiesList = newActivities;
        });
      }
    }
  }

  private buildAnimationDown(offset) {
    return this.builder.build([
      animate('500ms ease-in', style({ transform: `translateY(+${offset}px)` }))
    ]);
  }


  getImgSourceForPublicActivityType(type: PublicActivityType): string {
    if (type === PublicActivityType.SIGNED_PETITION) {
      return 'assets/landing/icon_partners.jpg';
    } else if (type === PublicActivityType.SENT_BROADCAST) {
      return 'assets/landing/icon_call_broadcast.png';
    } else if (type === PublicActivityType.CREATED_GROUP) {
      return 'assets/landing/icon_create_group.jpg';
    } else if (type === PublicActivityType.CALLED_MEETING) {
      return 'assets/landing/icon_call_meeting.jpg';
    } else if (type === PublicActivityType.CREATED_ALERT) {
      return 'assets/icon_megaphone.png';
    } else if (type === PublicActivityType.CREATED_CAMPAIGN) {
      return 'assets/icon_megaphone.png';
    } else if (type === PublicActivityType.JOINED_GROUP) {
      return 'assets/landing/icon_connect.jpg';
    } else if (type === PublicActivityType.CALLED_VOTE) {
      return 'assets/landing/icon_vote.jpg';
    } else if (type === PublicActivityType.CREATED_TODO) {
      return 'assets/landing/icon_create_action.jpg';
    }
  }

  getIconForPublicActivityType(type: PublicActivityType): string {
    if (type === PublicActivityType.SIGNED_PETITION) {
      return 'far fa-file-alt';
    } else if (type === PublicActivityType.SENT_BROADCAST) {
      return 'fas fa-bullhorn';
    } else if (type === PublicActivityType.CREATED_GROUP) {
      return 'fas fa-users';
    } else if (type === PublicActivityType.CALLED_MEETING) {
      return 'far fa-calendar-alt';
    } else if (type === PublicActivityType.CREATED_ALERT) {
      return 'fas fa-exclamation-triangle';
    } else if (type === PublicActivityType.CREATED_CAMPAIGN) {
      return 'fas fa-bullhorn';
    } else if (type === PublicActivityType.JOINED_GROUP) {
      return 'fa-user-plus';
    } else if (type === PublicActivityType.CALLED_VOTE) {
      return 'far fa-check-square';
    } else if (type === PublicActivityType.CREATED_TODO) {
      return 'far fa-check-square';
    }
  }

  loadNews() {
    this.publicNewsService.loadLastFiveNews()
      .subscribe(news => {
        this.newsList = news.content;
      });
  }

}
