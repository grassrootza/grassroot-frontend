import {Component, OnInit} from '@angular/core';
import {CampaignInfo} from "../model/campaign-info";
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {CampaignService} from "../campaign.service";
import {AlertService} from "../../utils/alert-service/alert.service";
import {MediaService} from "../../media/media.service";
import {MediaFunction} from "../../media/media-function.enum";

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-campaign-dashboard',
  templateUrl: './campaign-dashboard.component.html',
  styleUrls: ['./campaign-dashboard.component.css']
})
export class CampaignDashboardComponent implements OnInit {

  public campaign: CampaignInfo = null;
  public currentTab: string = "analyze";
  public hasMedia: boolean = false;

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
          // console.log('current uri: ', uri);
          this.currentTab = uri.substring(uri.lastIndexOf("/") + 1);
          // console.log('current tab: ', this.currentTab);
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
        this.checkForMediaRecords(campaignUid);
      }, error2 => {
        console.log("Error loading campaign", error2.status);
        this.alertService.hideLoadingDelayed();
      });
    });
  }

  checkForMediaRecords(campaignUid: string) {
    console.log('Fetching campaign media, for campaign: ', this.campaign.name);
    this.campaignService.fetchCampaignMedia(campaignUid).subscribe(result => {
      console.log('Result of media fetch: ', result);
      this.hasMedia = !!result && result.length > 0;
      return result;
    }, error => console.log('Error fetching media list: ', error))
  }

  exportToExcel() {
    this.campaignService.downloadCampaignStats(this.campaign.campaignUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/xls' });
      saveAs(blob, this.campaign.name + ".xlsx");
    }, error => {
      console.log("error getting the file: ", error);
    });
    return false;
  }

  downloadBillingData() {
    this.campaignService.downloadCampaignBillingData(this.campaign.campaignUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/xls' });
      saveAs(blob, this.campaign.name + "-BillingData.xls")
    }, error => {
      console.log("Error downloading campaign billing data: ", error);
    });
    return false;
  }

}
