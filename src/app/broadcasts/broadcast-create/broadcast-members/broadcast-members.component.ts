import {Component, OnInit} from '@angular/core';
import {BroadcastCost, BroadcastMembers, BroadcastTypes} from "../../model/broadcast-request";
import {BroadcastService} from "../../broadcast.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BroadcastParams} from "../../model/broadcast-params";
import {GroupService} from "../../../groups/group.service";
import {Group} from "../../../groups/model/group.model";
import {MembersFilter} from "../../../groups/member-filter/filter.model";
import {AlertService} from "../../../utils/alert.service";
import {User} from "../../../user/user.model";
import {getUserFromMembershipInfo} from "../../../groups/model/membership.model";

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
  private memberFilter = new MembersFilter();

  constructor(private router: Router, private formBuilder: FormBuilder,
              private broadcastService: BroadcastService,
              private groupService: GroupService,
              private alertService: AlertService) {
    this.countParams = new BroadcastCost();
    this.createParams = this.broadcastService.getCreateParams();
    console.log("on construction, create params: ", this.createParams);
    this.memberForm = formBuilder.group({
      'selectionType': ['ALL_MEMBERS', Validators.required],
      'taskTeams': []
    }, {validator: ttSelectedIfTTs });
  }

  ngOnInit() {
    let storedEntity = this.broadcastService.getMembers();
    console.log("stored entity: ", storedEntity);
    if (storedEntity.selectionType != 'ALL_MEMBERS') {
      this.memberForm.controls['selectionType'].setValue(storedEntity.selectionType);
      if (storedEntity.taskTeams) {
        this.memberForm.controls['taskTeams'].setValue(storedEntity.taskTeams);
      }
      this.memberFilter = storedEntity.memberFilter;
    }

    this.groupService.loadGroupDetailsCached(this.broadcastService.parentId()).subscribe(group => {
      this.group = group;
      console.log("okay, got what we need, calculating costs and numbers");
      this.calculateCosts(this.group.members.map(getUserFromMembershipInfo));
    });

    // in case we are reloading
    this.broadcastService.createParams.subscribe(params => {
      this.createParams = params;
      if (this.group) {
        this.calculateCosts(this.group.members.map(getUserFromMembershipInfo));
      }
    });

    this.setUpSelectChangeReaction();
  }

  setupDefaultCounts() {
    this.countParams = new BroadcastCost();
    this.types = this.broadcastService.getTypes();
    this.countParams.totalNumber = this.createParams.allMemberCount;
    this.countParams.smsNumber = this.types.shortMessage ? this.createParams.allMemberCount : 0;
    this.calculateCosts();
  }

  setUpSelectChangeReaction() {
    this.memberForm.controls['selectionType'].valueChanges.subscribe(value => {
      if (value === 'ALL_MEMBERS') {
        this.setupDefaultCounts();
      } else if (value == 'TASK_TEAMS') {
        console.log("switched to task teams");
        this.taskTeamSelectChanged();
      } else if (value == 'CUSTOM_SELECTION') {
        this.membersFilterChanged(this.memberFilter);
      }
    })
  }

  taskTeamSelectChanged() {
    let impliedFilter = new MembersFilter();
    impliedFilter.taskTeams = this.memberForm.controls['taskTeams'].value;
    console.log("selected task teams, taking it as: ", impliedFilter);
    this.membersFilterChanged(impliedFilter);
  }

  membersFilterChanged(filter: MembersFilter) {
    console.log("Members filter change, loading members... filter: ", filter);
    this.memberFilter = filter;
    this.groupService.filterGroupMembers(this.group.groupUid, filter)
      .subscribe(members => {
          // this.countParams.totalNumber = members.length;
          // this.countParams.smsNumber = members.reduce((total,m) => m.user.phoneNumber ? total+1 : total, 0);
          // this.countParams.emailNumber = members.reduce((total, m) => m.user.email ? total+1 : total, 0);
          this.calculateCosts(members.map(m => m.user));
        },
        error => {
          this.alertService.hideLoading();
          console.log("Error fetching members", error);
        }
      );
  }

  calculateCosts(members: User[] = []) {
    this.countParams.totalNumber = members.length;
    this.countParams.smsNumber = members.reduce((total,m) => m.phoneNumber ? total+1 : total, 0);
    this.countParams.emailNumber = members.reduce((total, m) => m.email ? total+1 : total, 0);
    this.countParams.broadcastCost = (this.countParams.smsNumber * this.createParams.smsCostCents / 100).toFixed(2);
    console.log("fetched members, count params now: ", this.countParams);
  }

  saveMemberSelection() {
    if (!this.memberForm.valid) {
      return false;
    }
    let entity: BroadcastMembers = this.memberForm.value;
    entity.memberFilter = this.memberFilter;
    this.broadcastService.setMembers(entity);
    this.broadcastService.setMessageCounts(this.countParams);
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

export const ttSelectedIfTTs = (form: FormGroup) => {
  let fbCheck = form.get('selectionType');
  if (fbCheck && fbCheck.value === 'TASK_TEAMS') {
    return Validators.required(form.get('taskTeams'))
  }
  return null;
};
