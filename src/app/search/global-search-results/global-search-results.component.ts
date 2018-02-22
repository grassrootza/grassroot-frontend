import { Component, OnInit } from '@angular/core';
import {AlertService} from "../../utils/alert.service";
import {NavigationEnd, Router} from "@angular/router";
import {CampaignService} from "../../campaigns/campaign.service";

@Component({
  selector: 'app-global-search-results',
  templateUrl: './global-search-results.component.html',
  styleUrls: ['./global-search-results.component.css']
})
export class GlobalSearchResultsComponent implements OnInit {

  public currentTab: string = "my-activities";

  constructor(private alertService:AlertService,
              private router: Router,private campaignService:CampaignService) {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        let uri = ev.urlAfterRedirects;
        let nextTab = uri.substring(uri.lastIndexOf('/') + 1);

        this.currentTab = nextTab;
      }
    });
  }
  ngOnInit() {
    this.alertService.hideLoadingDelayed();

    this.campaignService.campaignInfoList.subscribe(
      campaignList => {
        console.log("Retrieved campaign list ", campaignList);
      }
    );
  }

}
