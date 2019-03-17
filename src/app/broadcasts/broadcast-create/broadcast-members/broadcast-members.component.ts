import {Component, OnInit} from '@angular/core';
import {BroadcastCost, BroadcastMembers, BroadcastTypes} from "../../model/broadcast-request";
import {BroadcastService} from "../../broadcast.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BroadcastParams} from "../../model/broadcast-params";
import {GroupService} from "../../../groups/group.service";
import {Group} from "../../../groups/model/group.model";
import {MembersFilter, copyFilter} from "../../../groups/member-filter/filter.model";
import {AlertService} from "../../../utils/alert-service/alert.service";
import {Membership, getMemberFromMembershipInfo, MembersPage} from "../../../groups/model/membership.model";
import { CampaignService } from '../../../campaigns/campaign.service';
import { CampaignInfo } from '../../../campaigns/model/campaign-info';

@Component({
  selector: 'app-broadcast-members',
  templateUrl: './broadcast-members.component.html',
  styleUrls: ['./broadcast-members.component.css', '../broadcast-create.component.css']
})
export class BroadcastMembersComponent implements OnInit {

  memberForm: FormGroup;

  public createParams: BroadcastParams;
  public countParams: BroadcastCost;
  public types: BroadcastTypes;
  private skipSmsIfEmail: boolean = false; // we may need to use this X000 times repeatedly, so stashing it as well as in-form

  public memberCount: number;
  public filteredMemberNames: string[];

  public group: Group;
  public campaign: CampaignInfo;

  private memberFilter = new MembersFilter();
  private priorStoredFilter = new MembersFilter();

  constructor(private router: Router, private formBuilder: FormBuilder,
              private broadcastService: BroadcastService,
              private groupService: GroupService,
              private campaignService: CampaignService,
              private alertService: AlertService) {
    this.countParams = new BroadcastCost();
    this.createParams = this.broadcastService.getCreateParams();
    // console.log('broadcast create params: ', this.createParams);
    this.memberForm = formBuilder.group({
      'selectionType': ['ALL_MEMBERS', Validators.required],
      'taskTeams': [],
      'skipSmsIfEmail': [false],
    }, {validator: ttSelectedIfTTs });
  }

  ngOnInit() {
    let storedEntity = this.broadcastService.getMembers();
    // console.log("stored entity: ", storedEntity);
    if (storedEntity.selectionType != 'ALL_MEMBERS') {
      this.memberForm.controls['selectionType'].setValue(storedEntity.selectionType);
      if (storedEntity.taskTeams) {
        this.memberForm.controls['taskTeams'].setValue(storedEntity.taskTeams);
      }
      this.memberFilter = storedEntity.memberFilter;
    }

    // console.log('broadcast type: ', this.broadcastService.currentType());
    if (this.broadcastService.currentType() == 'campaign') {
      this.campaignService.loadCampaign(this.broadcastService.parentId()).subscribe(cp => {
        this.campaign = cp;
        this.setupGroup(this.campaign.masterGroupUid, false);
      })
    } else  {
      this.setupGroup(this.broadcastService.parentId());
    }

    // in case we are reloading
    this.broadcastService.createParams.subscribe(params => {
      this.createParams = params;
      if (this.group && this.broadcastService.currentType() != 'campaign') {
        console.log('group, calculate members of it');
        this.recalculateTotals(this.group.members.map(getMemberFromMembershipInfo));
      }

      let selectedTypes = this.broadcastService.getTypes();
      if (this.broadcastService.currentStep == 3 && !selectedTypes.shortMessage && !selectedTypes.email) {
        this.next(true); // since there is no point
      }

    });

    this.setupDefaultCounts();
    this.setUpSelectChangeReaction();
  }

  setupGroup(groupId: string, useGroupForCounts: boolean = true) {
    this.groupService.loadGroupDetailsCached(groupId).subscribe(group => {
      this.group = group;
      this.membersFilterChanged(new MembersFilter());
    });
  }

  setupDefaultCounts() {
    this.countParams = new BroadcastCost();
    this.types = this.broadcastService.getTypes();
    this.countParams.totalNumber = this.createParams.allMemberCount;
    this.countParams.smsNumber = this.types.shortMessage ? this.createParams.allMemberCount : 0;
    this.countParams.emailNumber = this.types.shortMessage ? this.createParams.allMemberCount : 0;
    this.countParams.broadcastCost = (this.countParams.smsNumber * this.createParams.smsCostCents / 100).toFixed(2);

    // console.log('have set up default counts, total number: ', this.countParams.totalNumber);
  }

  recalculateTotals(members: Membership[] = []) {
    this.skipSmsIfEmail = this.memberForm.controls['skipSmsIfEmail'].value;
    this.countParams.totalNumber = members.length;
    this.countParams.smsNumber = members.reduce((total,m) => this.includeMemberInSms(m) ? total+1 : total, 0);
    this.countParams.emailNumber = members.reduce((total, m) => m.emailAddress ? total+1 : total, 0);
    this.countParams.broadcastCost = (this.countParams.smsNumber * this.createParams.smsCostCents / 100).toFixed(2);
    // console.log('fetched members, count params now: ', this.countParams);
  }

  recalculateFromPage(members: MembersPage) {
    this.skipSmsIfEmail = this.memberForm.controls['skipSmsIfEmail'].value;
    this.countParams.totalNumber = members.totalElements;
    this.countParams.smsNumber = members.numberSms - (this.skipSmsIfEmail ? members.numberSmsAndEmail : 0);
    this.countParams.emailNumber = members.numberEmail;
    this.countParams.broadcastCost = (this.countParams.smsNumber * this.createParams.smsCostCents / 100).toFixed(2);
  }

  setUpSelectChangeReaction() {
    this.memberForm.controls['selectionType'].valueChanges.subscribe(value => {
      if (value === 'ALL_MEMBERS') {
        this.filteredMemberNames = [];
        this.setupDefaultCounts();
      } else if (value == 'TASK_TEAMS') {
        this.filteredMemberNames = [];
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
    console.log('Existing filter: ', this.priorStoredFilter);
    console.log('Received filter: ', filter);
    if (!this.priorStoredFilter.hasAnythingChanged(filter)) {
      console.log('Nothing changed, dont fire to server');
      this.memberFilter = filter;
      return;
    }

    this.memberFilter = filter;
    this.priorStoredFilter = copyFilter(this.memberFilter);
    
    this.groupService.filterGroupMembers(this.group.groupUid, filter).subscribe(members => {
          // console.log('from server: ', members);
          let filteredMembers = filter.role == 'ANY' ? members.content : members.content.filter(m => m.roleName == filter.role);
          this.recalculateFromPage(members);
          if (filteredMembers && filteredMembers.length > 0 && filteredMembers.length < 10) {
            this.filteredMemberNames = members.content.map(member => member.displayName);
          } else {
            this.filteredMemberNames = [];
          }
        },
        error => {
          this.alertService.hideLoading();
          console.log("Error fetching members", error);
        }
      );
  }

  // todo: think through caching etc in here
  skipEmailToggled() {
    this.membersFilterChanged(this.memberFilter);
  }

  includeMemberInSms(member: Membership): boolean {
    return member && member.phoneNumber && (!this.skipSmsIfEmail || !member.emailAddress);
  }

  saveMemberSelection() {
    if (!this.memberForm.valid) {
      return false;
    }
    let entity: BroadcastMembers = this.memberForm.value;
    // console.log("members entity: ", entity);
    entity.memberFilter = this.memberFilter;
    this.broadcastService.setMembers(entity);
    this.broadcastService.setMessageCounts(this.countParams);
    // console.log("stored member selection, looks like: ", this.broadcastService.getMembers());
    return true;
  }

  next(skipValidity = false) {
    if (skipValidity || this.saveMemberSelection()) {
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
