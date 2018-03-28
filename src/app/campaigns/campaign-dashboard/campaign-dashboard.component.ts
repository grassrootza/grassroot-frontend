import {Component, OnInit} from '@angular/core';
import {CampaignInfo} from "../model/campaign-info";
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {CampaignService} from "../campaign.service";
import {AlertService} from "../../utils/alert-service/alert.service";
import {MediaService} from "../../media/media.service";
import {MediaFunction} from "../../media/media-function.enum";

@Component({
  selector: 'app-campaign-dashboard',
  templateUrl: './campaign-dashboard.component.html',
  styleUrls: ['./campaign-dashboard.component.css']
})
export class CampaignDashboardComponent implements OnInit {

  public campaign: CampaignInfo = null;
  public currentTab: string = "analyze";

  public campaignImageUrl: string;

  constructor(private campaignService: CampaignService,
              private mediaService: MediaService,
              private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService) {

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        if (this.campaign != null) {
          let uri = ev.urlAfterRedirects;
          let startIndex = uri.indexOf(this.campaign.campaignUid) + this.campaign.campaignUid.length + 1;
          this.currentTab = uri.substring(startIndex);
          if (this.currentTab.indexOf("/") >= 0)
            this.currentTab = this.currentTab.substring(0, this.currentTab.indexOf("/"));
        }
      }
    });

  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let campaignUid = params['id'];
      this.campaignService.loadCampaign(campaignUid).subscribe(campaignInfo => {
        this.campaign = campaignInfo;
        // todo : use an event emitter to reload this if it changes on settings
        if (this.campaign.campaignImageKey) {
          this.campaignImageUrl = this.mediaService.getImageUrl(MediaFunction.CAMPAIGN_IMAGE, this.campaign.campaignImageKey);
        }
        this.alertService.hideLoadingDelayed();
      }, error2 => {
        console.log("Error loading campaign", error2.status);
        this.alertService.hideLoadingDelayed();
      })
    });

  }

}
