import { Component, OnInit } from '@angular/core';
import {CampaignService} from "../../../campaigns/campaign.service";
import {CampaignInfo} from "../../../campaigns/model/campaign-info";
import {ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../../user/user.service";

@Component({
  selector: 'app-my-campaigns',
  templateUrl: './my-campaigns.component.html',
  styleUrls: ['./my-campaigns.component.css']
})
export class MyCampaignsComponent implements OnInit {

  private userUid:string = "";
  private searchTerm:string = "";
  public filteredCampaigns: CampaignInfo[] = [];


  constructor(private campaignService: CampaignService,
              private userService:UserService,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.userUid = this.userService.getLoggedInUser().userUid;
    this.route.parent.params.subscribe((params:Params) =>{
      this.searchTerm = params['searchTerm'];
      this.loadUserCampaignsWithWithSearchTerm(this.searchTerm);
    });
  }

  loadUserCampaignsWithWithSearchTerm(searchTerm:string){
    this.campaignService.campaignInfoList.subscribe(campaigns =>{
      this.filteredCampaigns =
        campaigns.filter(cp => cp.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                        cp.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
      console.log("Filtered campaigns..............",this.filteredCampaigns);
    })
  }

}
