import {Component, Input, OnInit} from '@angular/core';
import {MembersPage} from "../../../model/membership.model";
import {MembersFilter} from "../../../member-filter/filter.model";
import {GroupService} from "../../../group.service";
import {Group} from "../../../model/group.model";
import {ActivatedRoute, Params} from "@angular/router";
import {CampaignService} from "../../../../campaigns/campaign.service";
import {CampaignInfo} from "../../../../campaigns/model/campaign-info";

@Component({
  selector: 'app-group-custom-filter',
  templateUrl: './group-custom-filter.component.html',
  styleUrls: ['./group-custom-filter.component.css']
})
export class GroupCustomFilterComponent implements OnInit {


  currentPage: MembersPage = null;

  @Input()
  group: Group;

  groupCampaigns: CampaignInfo[] = [];


  constructor(private groupService: GroupService,
              private campaignService: CampaignService,
              private route: ActivatedRoute) {
  }


  ngOnInit() {

    this.route.parent.parent.params.subscribe((params: Params) => {
      const groupUid = params['id'];
      this.groupService.loadGroupDetails(groupUid)
        .subscribe(
          groupDetails => {
            this.group = groupDetails;

            this.campaignService.loadGroupCampaigns(this.group.groupUid)
              .subscribe(
                campaigns => {
                  this.groupCampaigns = campaigns;
                },
                error => {
                  console.log("Failed to fetch group campaigns", error);
                }
              );

          },
          error => {
            console.log("Error loading groups", error.status)
          }
        );
    });
  }

  membersFilterChanged(filter: MembersFilter) {

    console.log("Members filter change, loading members...");

    this.groupService.filterGroupMembers(this.group.groupUid, filter.provinces, filter.taskTeams, filter.topics, filter.joinSources, filter.campaigns)
      .subscribe(
        members => {
          console.log("Fetched filtered members: ", members);
          this.currentPage = new MembersPage(0, 1, members.length, members.length, true, true, members);
        },
        error => console.log("Error fetching members", error)
      );
  }



}
