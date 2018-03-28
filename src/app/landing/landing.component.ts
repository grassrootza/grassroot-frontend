import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { AlertService } from '../utils/alert.service';
import { PublicActivityType } from './model/public-activity-type.enum';
import { PublicActivity } from './model/public-activity.model';
import { PublicLivewire } from './model/public-livewire.model';
import { PublicActivityService } from './public-activity.service';
import { PublicNewsService } from './public-news.service';


declare var $: any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: [ './landing.component.css' ]
})
export class LandingComponent implements OnInit, AfterViewInit {

  @ViewChild('tasknote') carouselPlaceHolder: ElementRef;
  @ViewChild('activitiesRow') activitiesRow: ElementRef;
  @ViewChild('activitiesPlaceHolder') activitiesPlaceHolder: ElementRef;

  public activitiesList: PublicActivity[] = [];
  public newsList: PublicLivewire[] = [];
  public carouselContainerWidth: number = 0;
  public activitiesHeight: number = 0;

  private player: AnimationPlayer;


  constructor(private alertService: AlertService,
    private publicActivityService: PublicActivityService,
    private publicNewsService: PublicNewsService,
    private cdr: ChangeDetectorRef,
    private builder: AnimationBuilder) {
  }

  ngOnInit() {
    this.alertService.hideLoadingDelayed();

    //load public activity first time component is initialized
    this.publicActivityService.loadLastFiveActivities()
      .subscribe(activities => {
        this.activitiesList = activities;

        setTimeout(() => {
          this.activitiesHeight = this.activitiesRow.nativeElement.offsetHeight;
        });

      });

    //load new public activity every minute after that (60000 ms = 1min), remove this if we dont need to update news when user is on page.
    Observable.interval(60000)
      .subscribe(() => {
        this.loadPublicActivity();
      });

    //load news first time component is initialized.
    this.loadNews();

    //load news every 2 mins after that (120000 ms = 2min), remove this if we dont need to update news when user is on page.
    Observable.interval(120000)
      .subscribe(() => {
          this.loadNews();
        }
      );
  }

  loadPublicActivity() {
    this.publicActivityService.loadLastFiveActivities()
      .subscribe(activities => {

        console.log(activities);
        const numberOfNewActivities = this.getNumberOfNewActivities(activities);
        if (numberOfNewActivities > 0) {
          console.log('starting animation');
          this.playActivitiesAnimation(numberOfNewActivities, activities);
        }
      });
  }

  getNumberOfNewActivities(newActivities: PublicActivity[]): number {
    console.log('calling check new activities');
    const arrayAreEqual = _(this.activitiesList)
      .differenceWith(newActivities, _.isEqual)
      .isEmpty();

    if (!arrayAreEqual) {
      const mergedArrays = this.activitiesList.concat(newActivities);
      const numberOfUniqueMembersInMergedArray = _.map(
        _.uniq(
          _.map(mergedArrays, function (obj) {
            return JSON.stringify(obj);
          })
        ), function (obj) {
          return JSON.parse(obj);
        }
      ).length;

      return numberOfUniqueMembersInMergedArray - this.activitiesList.length;
    }
    return 0;
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
    }
  }

  loadNews() {
    this.publicNewsService.loadLastFiveNews()
      .subscribe(news => {
        this.newsList = news.content;
      });
  }


  ngAfterViewInit(): void {
    this.carouselContainerWidth = this.carouselPlaceHolder.nativeElement.offsetWidth;
    this.cdr.detectChanges();
  }

  public getTypeNameFormatted(type: PublicActivityType): string {
    return type.toString()
      .toLowerCase()
      .split('_')
      .join(' ');
  }

}
