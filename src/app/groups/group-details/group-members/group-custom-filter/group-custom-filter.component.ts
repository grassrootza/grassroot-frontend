import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Membership, MembersPage} from "../../../model/membership.model";
import {MembersFilter} from "../../../member-filter/filter.model";
import {GroupService} from "../../../group.service";
import {Group} from "../../../model/group.model";
import {ActivatedRoute, Params} from "@angular/router";
import {CampaignService} from "../../../../campaigns/campaign.service";
import {CampaignInfo} from "../../../../campaigns/model/campaign-info";
import {MemberTopicsManageComponent} from "../member-topics-manage/member-topics-manage.component";

declare var $: any;

@Component({
  selector: 'app-group-custom-filter',
  templateUrl: './group-custom-filter.component.html',
  styleUrls: ['./group-custom-filter.component.css']
})
export class GroupCustomFilterComponent implements OnInit {

  currentPage: MembersPage = null;
  currentFilter: MembersFilter = new MembersFilter();
  filteredMembers: Membership[] = [];
  membersToManage: Membership[] = [];

  @Input() group: Group;
  groupCampaigns: CampaignInfo[] = [];

  @ViewChild('bulkTopicManageModal')
  private topicManageModal: MemberTopicsManageComponent;
  private bulkTopics: string[] = [];

  private loading = false;
  private loadStart = 0;

  constructor(private groupService: GroupService,
              private campaignService: CampaignService,
              private route: ActivatedRoute) {
  }


  ngOnInit() {
    this.route.parent.parent.params.subscribe((params: Params) => {
      const groupUid = params['id'];
      this.groupService.loadGroupDetailsCached(groupUid, false)
        .subscribe(groupDetails => {
          this.renderGroupDetails(groupDetails);
          this.membersFilterChanged(new MembersFilter()); //load all members (empty filter)
          }, error => {
            console.log("Error loading groups", error.status)
          }
        );
    });
  }

  renderGroupDetails(groupDetails: Group) {
    this.group = groupDetails;
    console.log("group topics: ", this.group.topics);
    this.campaignService.loadGroupCampaigns(this.group.groupUid)
      .subscribe(
        campaigns => {
          this.groupCampaigns = campaigns;
        },
        error => {
          console.log("Failed to fetch group campaigns", error);
        }
      );
  }

  membersFilterChanged(filter: MembersFilter) {
    this.loading = true;
    this.groupService.filterGroupMembers(this.group.groupUid, filter)
      .subscribe(
        members => {
          this.loading = false;
          this.filteredMembers = members;
          this.currentFilter = filter;
          this.currentPage = new MembersPage(0, 1, members.length, members.length, true, true, members);
        },
        error => {
          this.loading = false;
          console.log("Error fetching members", error);
        }
      );
  }

  setMembersToManage() {
    if (this.currentPage.getSelectedMembers().length > 0) {
      this.membersToManage = this.currentPage.getSelectedMembers();
    } else {
      this.membersToManage = this.filteredMembers;
    }
}

  addFilteredMembersToTaskTeam() {
    this.setMembersToManage();
    $('#filtered-add-to-task-team').modal('show');
  }

  bulkManageTopics() {
    this.setMembersToManage();
    this.bulkTopics = this.group.topics.filter(topic => {
      // js type weirdness makes this unpredictable if made into more elegant single line
      let topicsContained = this.membersToManage.map(member => member.topics.indexOf(topic) != -1);
      return topicsContained.reduce((prior, current) => prior && current);
    });
    this.topicManageModal.setupTopicSelect(this.bulkTopics);
    $('#bulk-member-assign-topics').modal('show');
  }

  refreshGroupDetails() {
    // in case we added a new task team etc. but leave filter intact in case user wants to use it.
    this.groupService.loadGroupDetailsFromServer(this.group.groupUid).subscribe(group => {
      this.renderGroupDetails(group);
      this.membersFilterChanged(this.currentFilter);
    });
  }

}
