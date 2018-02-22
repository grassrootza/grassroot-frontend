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

  protected pageSize: number = 4;
  protected numberOfPages: number = 1;
  protected totalCount: number = 0;
  public pagesList: number[] = [];
  protected filteredCampaignsPage: CampaignInfo[] = [];
  protected currentPage: number = 1;

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

      this.filteredCampaignsPage = this.filteredCampaigns.slice(0,this.pageSize);
      this.totalCount = this.filteredCampaigns.length;
      this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
      this.currentPage = 1;
      this.generatePageList(this.numberOfPages);
      console.log("Filtered campaigns..............",this.filteredCampaigns);
    })
  }

  generatePageList(numberOfPages: number){
    this.pagesList = [];
    for(let i=1;i<=numberOfPages;i++){
      this.pagesList.push(i);
    }
  }

  goToPage(page: number){
    this.currentPage = page;
    this.filteredCampaignsPage = this.filteredCampaigns.slice(this.pageSize*(page-1), this.pageSize*page);
  }

  previousPage(){
    if(this.currentPage != 1){
      this.currentPage = this.currentPage-1;
      this.goToPage(this.currentPage);
    }
  }

  nextPage(){
    if(this.currentPage != this.numberOfPages){
      this.currentPage = this.currentPage+1;
      this.goToPage(this.currentPage);
    }
  }
}
