import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Membership, MembersPage} from "../../../model/membership.model";
import {copyFilter, MembersFilter} from "../../../member-filter/filter.model";
import {GroupService} from "../../../group.service";
import {Group} from "../../../model/group.model";
import {ActivatedRoute, Params} from "@angular/router";
import {CampaignService} from "../../../../campaigns/campaign.service";
import {CampaignInfo} from "../../../../campaigns/model/campaign-info";
import {MemberTopicsManageComponent} from "../member-topics-manage/member-topics-manage.component";
import {GroupInfo} from "../../../model/group-info.model";
import {getCreateModalId} from "../../../../task/task-type";
import { AlertService } from '../../../../utils/alert-service/alert.service';

import { saveAs } from 'file-saver';

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
  filteredMemberUids: string[] = [];
  filteredMemberNames: string[] = [];

  membersToManage: Membership[] = [];

  topicMemberUids: string[] = [];
  topicMemberNames: string[] = [];

  groupsToCopyMembersTo: GroupInfo[] = [];

  @Input() group: Group;
  groupCampaigns: CampaignInfo[] = [];

  @ViewChild('bulkTopicManageModal')
  private topicManageModal: MemberTopicsManageComponent;

  private bulkTopics: string[] = [];

  public loading = false;
  public loadStart = 0;

  constructor(private groupService: GroupService,
              private campaignService: CampaignService,
              private route: ActivatedRoute,
              private alertService:AlertService) {
  }

  ngOnInit() {
    this.alertService.showLoading();
    this.route.parent.parent.params.subscribe((params: Params) => {
      const groupUid = params['id'];
      this.groupService.loadGroupDetailsCached(groupUid, false)
        .subscribe(groupDetails => {
          this.renderGroupDetails(groupDetails);
          this.membersFilterChanged(new MembersFilter(), true); //load all members (empty filter)
          this.alertService.hideLoadingDelayed();
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

  membersFilterChanged(filter: MembersFilter, forceFetch: boolean = false) {
    // console.log(`filter fired, has change: ${filter.hasNonRoleChanged(this.currentFilter)}`)
    if (forceFetch || filter.hasNonRoleChanged(this.currentFilter)) {
      this.loading = true;
      this.groupService.filterGroupMembers(this.group.groupUid, filter).subscribe(
        members => {
          console.log('resulting member page: ', members);
          this.loading = false;
          this.currentFilter = copyFilter(filter); // otherwise change detection fails, because child is actually modifying same thing
          this.currentPage = members;
          this.setFilteredMembers(members.content);
        },
        error => {
          this.loading = false;
          console.log("Error fetching members", error);
        }
      );
    } else {
      this.currentFilter = copyFilter(filter);
      console.log(`must have been role change, to: ${this.currentFilter.role}`);
      this.setFilteredMembers(this.filteredMembers);
    }
  }

  setFilteredMembers(members: Membership[]) {
    this.filteredMembers = members;
    if (this.currentFilter.role !== 'ANY') {
      members = members.filter(member => member.roleName == this.currentFilter.role);
    }
  }

  setMembersToManage() {
    if (this.currentPage.getSelectedMembers().length > 0) {
      this.membersToManage = this.currentPage.getSelectedMembers();
    } else {
      this.membersToManage = this.filteredMembers;
    }
  }

  setMembersToManageLite() {
    console.log('setting up uids and names');
    if (this.currentPage.getSelectedMembers().length > 0) {
      this.topicMemberUids = this.currentPage.getSelectedMembers().map(member => member.userUid);
    } else {
      this.topicMemberUids = this.filteredMembers.map(member => member.userUid);
    }
    console.log('alright, set up: ', this.topicMemberUids);
  }

  addFilteredMembersToTaskTeam() {
    this.setMembersToManage();
    $('#filtered-add-to-task-team').modal('show');
  }

  bulkManageTopics() {
    this.setMembersToManageLite();
    console.log('topic uids set up');
    this.bulkTopics = this.group.topics.filter(topic => {
      // js type weirdness makes this unpredictable if made into more elegant single line
      let topicsContained = this.membersToManage.map(member => member.topics.indexOf(topic) != -1);
      return topicsContained && topicsContained.length > 0 ? topicsContained.reduce((prior, current) => prior && current) : false;
    });
    console.log('also topics set up');
    this.topicManageModal.setupTopicSelect(this.bulkTopics);
    console.log('showing modal');
    $('#bulk-member-assign-topics').modal('show');
  }

  refreshGroupDetails() {
    // in case we added a new task team etc. but leave filter intact in case user wants to use it.
    this.groupService.loadGroupDetailsFromServer(this.group.groupUid).subscribe(group => {
      this.renderGroupDetails(group);
      this.membersFilterChanged(this.currentFilter);
    });
  }

  showBulkCopyToGroupModal(){
    this.setMembersToManage();
    console.log("copy members to group: " + this.membersToManage.length);
    this.groupService.groupInfoList.subscribe(groups => {
      this.groupsToCopyMembersTo = groups.filter(g => g.hasPermission("GROUP_PERMISSION_ADD_GROUP_MEMBER")
        && g.groupUid !== this.group.groupUid);
      $('#bulk-copy-members-to-group').modal('show');
    });
  }

  showCreateTaskModal(taskType: string) {
    this.setMembersToManage();
    this.filteredMemberUids = this.membersToManage.map(member => member.userUid);
    this.filteredMemberNames = this.membersToManage.map(member => member.displayName);
    $("#" + getCreateModalId(taskType)).modal('show');
  }

  taskCreated(saveResponse, type: string) {
    console.log(saveResponse);
    $("#" + getCreateModalId(type)).modal("hide");
  }

  downloadFilteredMembersExcel() {
    if (this.currentPage.totalElements > 100) {
      // this.alertService.showLoading();
      console.log('filtering members ...');
      this.groupService.filterGroupMembers(this.group.groupUid, this.currentFilter, this.currentPage.totalElements).subscribe(result => {
        let filteredMemberUids = result.content.map(member => member.userUid);
        console.log(`got ${filteredMemberUids.length} member UIDs to download`);
        this.performDownload(filteredMemberUids);
      })
    } else {
      this.filteredMemberUids = this.filteredMembers.map(member => member.userUid);
      this.performDownload(this.filteredMemberUids);
    }
  }

  performDownload(memberUids: string[]) {
    console.log('downloading members ...');
    this.groupService.downloadFilteredGroupMembers(this.group.groupUid, memberUids).subscribe(data => {
      this.alertService.hideLoading();
      let blob = new Blob([data], { type: 'application/xls' });
      saveAs(blob, 'filtered_members.xls');
    })
  }

}
