import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  public activitiesList: PublicActivity[] = [];
  public newsList: PublicLivewire[] = [];
  public carouselContainerWidth: number = 0;

  constructor(private alertService: AlertService,
    private publicActivityService: PublicActivityService,
    private publicNewsService: PublicNewsService,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.alertService.hideLoadingDelayed();
    this.publicActivityService.loadLastFiveActivities()
      .subscribe(activities => {
        this.activitiesList = activities;
      });

    //load news first time component is initialized.
    this.loadNews();

    //load news every 2 mins after that (120000 ms = 2min), remove this if we dont need to update news when user is on page.
    Observable.interval(120000).subscribe(() => {
      this.loadNews();
      }
    );
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
