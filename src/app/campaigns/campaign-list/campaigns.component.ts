import {Component, OnInit} from '@angular/core';
import {CampaignService} from "../campaign.service";
import {CampaignInfo} from "../model/campaign-info";
import {AlertService} from "../../utils/alert-service/alert.service";
import {UserService} from "../../user/user.service";

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  public canCreateOrManageCampaigns = false;

  public activeCampaigns: CampaignInfo[] = [];
  public pastCampaigns: CampaignInfo[] = [];

  constructor(private campaignService: CampaignService,
              private userService: UserService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.canCreateOrManageCampaigns = this.userService.hasActivePaidAccount();
    this.campaignService.campaignInfoList.subscribe(
      campaignList => {
        console.log("Retrieved campaign list ", campaignList);
        this.activeCampaigns = campaignList.filter(cp => cp.isActive());
        this.pastCampaigns = campaignList.filter(cp => !cp.isActive());
        this.alertService.hideLoadingDelayed();
      }
    );

    this.campaignService.loadCampaigns();
  }

}
