import {Component, OnInit} from '@angular/core';
import {CampaignService} from "../campaign.service";
import {CampaignInfo} from "../model/campaign-info";

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  public activeCampaigns: CampaignInfo[] = [];
  public pastCampaigns: CampaignInfo[] = [];

  constructor(private campaignService: CampaignService) { }

  ngOnInit() {
    this.campaignService.campaignInfoList.subscribe(
      campaignList => {
        console.log("Retrieved campaign list ", campaignList)

        this.activeCampaigns = campaignList.filter(cp => cp.isActive());
        this.pastCampaigns = campaignList.filter(cp => !cp.isActive());
      }
    );

    this.campaignService.loadCampaigns();
  }

}
