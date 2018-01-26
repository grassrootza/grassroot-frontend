import {Component, OnInit} from '@angular/core';
import {CampaignInfo} from "../model/campaign-info";
import {environment} from "../../../environments/environment";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {CampaignService} from "../campaign.service";
import {UserService} from "../../user/user.service";

@Component({
  selector: 'app-campaign-dashboard',
  templateUrl: './campaign-dashboard.component.html',
  styleUrls: ['./campaign-dashboard.component.css']
})
export class CampaignDashboardComponent implements OnInit {

  public campaign: CampaignInfo = null;
  public currentTab: string = "messages";

  public baseUrl: string = environment.backendAppUrl;

  constructor(private campaignService: CampaignService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService) {
  }

  ngOnInit() {
    console.log("initiating campaign dashboard");
    this.route.params.subscribe((params: Params) => {
      let campaignUid = params['id'];
      console.log("and now have loaded campaign UID: ", campaignUid);
      this.campaignService.loadCampaign(campaignUid).subscribe(campaignInfo => {
        this.campaign = campaignInfo;
      }, error2 => {
        // todo : maybe just retreat to home, and/or show an alert
        console.log("Error loading campaign", error2.status)
      })
    });
  }

}
