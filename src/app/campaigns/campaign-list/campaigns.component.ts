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

  public hasDisabledAccount = false;
  public canCreateCampaigns = false;
  public canManageCampaigns = false;
  
  public activeCampaigns: CampaignInfo[] = [];
  public pastCampaigns: CampaignInfo[] = [];

  constructor(private campaignService: CampaignService,
              private userService: UserService,
              private alertService: AlertService) { }

  ngOnInit() {
    this.canCreateCampaigns = this.userService.hasActivePaidAccount();
    this.hasDisabledAccount = this.userService.hasDisabledAccount();
    
    this.campaignService.campaignInfoList.subscribe(
      campaignList => {
        // console.log('Retrieved campaign list ', campaignList);
        this.activeCampaigns = campaignList.filter(cp => cp.isActive());
        this.pastCampaigns = campaignList.filter(cp => !cp.isActive());
        this.canManageCampaigns = campaignList && campaignList.length > 0;
        this.alertService.hideLoadingDelayed();
      }
    );

    this.campaignService.loadCampaigns();
  }

}
