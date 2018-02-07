import {Component, OnInit} from '@angular/core';
import {BroadcastCost, BroadcastMembers, BroadcastTypes} from "../../model/broadcast-request";
import {BroadcastService} from "../../broadcast.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BroadcastParams} from "../../model/broadcast-params";
import {GroupService} from "../../../groups/group.service";
import {Group} from "../../../groups/model/group.model";
import {MembersFilter} from "../../../groups/member-filter/filter.model";
import {AlertService} from "../../../utils/alert.service";

@Component({
  selector: 'app-broadcast-members',
  templateUrl: './broadcast-members.component.html',
  styleUrls: ['./broadcast-members.component.css', '../broadcast-create.component.css']
})
export class BroadcastMembersComponent implements OnInit {

  memberForm: FormGroup;

  public createParams: BroadcastParams;
  public countParams: BroadcastCost;
  private types: BroadcastTypes;

  public memberCount: number;

  public group: Group;
  private taskTeams = [];
  private memberFilter = new MembersFilter();

  constructor(private router: Router, private formBuilder: FormBuilder,
              private broadcastService: BroadcastService,
              private groupService: GroupService,
              private alertService: AlertService) {
    this.countParams = new BroadcastCost();
    this.createParams = this.broadcastService.getCreateParams();
    console.log("on construction, create params: ", this.createParams);
    this.memberForm = formBuilder.group(new BroadcastMembers());
  }

  ngOnInit() {
    this.memberForm.setValue(this.broadcastService.getMembers());
    this.broadcastService.createParams.subscribe(createParams => {
      this.createParams = createParams;
      this.setupDefaultCounts();
    });

    this.groupService.loadGroupDetailsCached(this.broadcastService.parentId()).subscribe(group => {
      this.group = group;
    });
  }

  setupDefaultCounts() {
    this.countParams = new BroadcastCost();
    this.types = this.broadcastService.getTypes();
    this.countParams.totalNumber = this.createParams.allMemberCount;
    this.countParams.smsNumber = this.types.shortMessage ? this.createParams.allMemberCount : 0;
    this.calculateCosts();
  }

  taskTeamSelectChanged() {
    let selectedTeams = this.memberForm.controls['taskTeams'].value;
    this.taskTeams = selectedTeams.map(stid => this.group.subGroups.find(sg => sg.groupUid === stid));
    this.memberFilter.taskTeams = selectedTeams;
    this.membersFilterChanged(this.memberFilter);
  }

  membersFilterChanged(filter: MembersFilter) {
    console.log("Members filter change, loading members... filter: ", filter);
    this.alertService.showLoading();
    this.memberFilter = filter;
    this.groupService.filterGroupMembers(this.group.groupUid, filter)
      .subscribe(
        members => {
          this.alertService.hideLoading();
          this.countParams.totalNumber = members.length;
          this.countParams.smsNumber = members.reduce((total,m) => m.user.phoneNumber ? total+1 : total, 0);
          this.countParams.emailNumber = members.reduce((total, m) => m.user.email ? total+1 : total, 0);
          console.log("fetched members, count params now: ", this.countParams);
          this.calculateCosts();
        },
        error => {
          this.alertService.hideLoading();
          console.log("Error fetching members", error);
        }
      );
  }

  calculateCosts() {
    this.countParams.broadcastCost = (this.countParams.smsNumber * this.createParams.smsCostCents / 100).toFixed(2);
  }

  saveMemberSelection() {
    if (!this.memberForm.valid) {
      return false;
    }
    this.broadcastService.setMembers(this.memberForm.value);
    console.log("stored member selection, looks like: ", this.broadcastService.getMembers());
    return true;
  }

  next() {
    if (this.saveMemberSelection()) {
      this.broadcastService.setPageCompleted('members');
      this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'schedule']);
    }
  }

  back() {
    // as with content, stash but don't validate
    this.broadcastService.setMembers(this.memberForm.value);
    this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'content']);
  }

  cancel() {
    this.broadcastService.cancelCurrentCreate();
  }

}
