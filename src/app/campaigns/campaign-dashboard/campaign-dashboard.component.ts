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
    this.route.params.subscribe((params: Params) => {
      let campaignUid = params['id'];
      this.campaignService.loadCampaign(campaignUid).subscribe(campaignInfo => {
        console.log("result: ", campaignInfo);
        this.campaign = campaignInfo;
      }, error2 => {
        if (error2.status = 401)
          this.userService.logout();
        console.log("Error loading campaign", error2.status)
      })
    });
  }

}
