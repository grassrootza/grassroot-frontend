import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Membership, MembersPage} from '../../../model/membership.model';
import {GroupService} from '../../../group.service';
import {Group} from '../../../model/group.model';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {emailOrPhoneEntered, optionalEmailValidator, optionalPhoneValidator} from '../../../../validators/CustomValidators';
import {GroupAddMemberInfo} from '../../../model/group-add-member-info.model';
import {GroupRole} from '../../../model/group-role';
import {UserProvince} from '../../../../user/model/user-province.enum';
import {AlertService} from "../../../../utils/alert-service/alert.service";
import {MemberTopicsManageComponent} from "../member-topics-manage/member-topics-manage.component";

declare var $: any;

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  @Input() public currentPage: MembersPage = null;
  @Input() public group: Group = null;
  @Input() public isTaskTeam: boolean = false;
  @Input() public showSortToggles: boolean = true;

  @Output() memberRemoved: EventEmitter<any>;
  @Output() shouldReloadList: EventEmitter<boolean>;
  @Output() sortUserList: EventEmitter<string[]>;

  @ViewChild('singleMemberTopicModal')
  private memberTopicManage: MemberTopicsManageComponent;

  showNameFilter: number = 0;
  showRoleFilter: number = 0;
  showProvinceFilter: number = 0;
  showPhoneFilter: number = 0;
  showEmailFilter: number = 0;

  singleMemberManage: Membership = null;

  membersManage: Membership[] = [];
  currentTaskTeams: string[] = null;

  public editMemberForm: FormGroup;
  public protectedEditControls: FormArray;

  province = UserProvince;
  provinceKeys: string[];
  role = GroupRole;
  roleKeys: string[];

  public roleChanged:boolean = false;

  public coreDetailsChanged: boolean = false;
  public withinGroupAttrsChanged: boolean = false;

  private editComplete = new EventEmitter<boolean>();

  constructor(private groupService: GroupService,
              private alertService: AlertService,
              private fb: FormBuilder) {
    this.memberRemoved = new EventEmitter<any>();
    this.shouldReloadList = new EventEmitter<boolean>();
    this.sortUserList = new EventEmitter<string[]>();
    this.editMemberForm = fb.group(new GroupAddMemberInfo(), { validator: emailOrPhoneEntered("memberEmail", "phoneNUmber")});
    this.provinceKeys = Object.keys(this.province);
    this.roleKeys = Object.keys(GroupRole);
    this.setupEditFormProperties();
  }

  private setupEditFormProperties() {
    this.editMemberForm.controls['displayName'].setValidators([Validators.required]);
    this.editMemberForm.controls['roleName'].setValidators([Validators.required]);
    this.editMemberForm.controls['memberEmail'].setValidators(optionalEmailValidator);
    this.editMemberForm.controls['phoneNumber'].setValidators(optionalPhoneValidator);

    this.protectedEditControls = this.fb.array([this.editMemberForm.controls['displayName'],
      this.editMemberForm.controls['phoneNumber'],
      this.editMemberForm.controls['memberEmail'],
      this.editMemberForm.controls['province']]);
  }

  ngOnInit() {
  }

  refreshGroupAndList() {
    this.groupService.loadGroupDetailsFromServer(this.group.groupUid).subscribe(group => this.group = group);
    this.shouldReloadList.emit();
  }

  selectMember(member: Membership) {
    member.selected = !member.selected;
  }

  public selectAllOnPage(event): void {
    let target = event.target || event.srcElement || event.currentTarget;
    let shouldSelectAll = target.checked;
    this.currentPage.content.forEach(m => m.selected = shouldSelectAll);
  }

  showMemberRemoveModal(member: Membership){
    this.singleMemberManage = member;
    $('#confirm-user-removal-modal').modal("show");
  }

  removeMember(memberUid: string){
    let groupUid = this.currentPage.content[0].group.groupUid;
    let memberUids: string[] = [];
    memberUids.push(memberUid);

    this.groupService.removeMembers(groupUid, memberUids).subscribe(response => {
      this.memberRemoved.emit();
    });
    $('#confirm-user-removal-modal').modal("hide");
  }

  showAddMemberToTaskTeamModal(member: Membership){
    this.singleMemberManage = member;
    this.membersManage = [member];
    $('#add-member-to-task-team').modal('show');
  }

  showAssignTopicToMemberModal(member: Membership){
    this.singleMemberManage = member;
    this.membersManage = [member];
    this.memberTopicManage.setupTopicSelect(member.topics);
    $('#member-assign-topics').modal('show');
  }

  showEditModal(member: Membership){
    $('#member-edit-modal').modal('show');
    this.editMemberForm.controls['displayName'].setValue(member.user.displayName);
    this.editMemberForm.controls['roleName'].setValue(member.roleName);
    this.editMemberForm.controls['phoneNumber'].setValue(member.user.phoneNumber != null ? member.user.phoneNumber : "");
    this.editMemberForm.controls['memberEmail'].setValue(member.user.email != null ? member.user.email : "");
    this.editMemberForm.controls['province'].setValue(member.user.province);
    this.editMemberForm.controls['affiliations'].setValue(member.affiliations.join(","));
    this.editMemberForm.controls['taskTeams'].setValue(member.group.subGroups != null ? member.group.subGroups : "");

    if (!member.canEditDetails) {
      this.protectedEditControls.disable();
    } else {
      this.protectedEditControls.enable();
    }

    this.singleMemberManage = member;
    this.currentTaskTeams = this.group.subGroups.filter(g => g.hasMember(member.user.uid)).map(g => g.groupUid);
  }

  roleChangedTrigger(){
    this.roleChanged = true;
  }

  coreDetailsChangedTrigger(){
    this.coreDetailsChanged = true;
  }

  withinGroupDetailsChangedTrigger() {
    this.withinGroupAttrsChanged = true;
  }

  hasAffiliations(member: Membership) {
    return member && member.affiliations && member.affiliations.length > 0 &&
      !member.affiliations.every(s => !s);
  }

  sortData(fieldToSort: string){
    console.log(`sorting data by field: ${fieldToSort}`);
    let direction = "";
    if(fieldToSort === "user.displayName"){
      this.showRoleFilter = 0;
      this.showProvinceFilter = 0;
      this.showPhoneFilter = 0;
      this.showEmailFilter = 0;
      switch (this.showNameFilter){
        case 0: this.showNameFilter = 1; direction = "asc"; break;
        case 1: this.showNameFilter = 2; direction = "desc"; break;
        case 2: this.showNameFilter = 0; direction = ""; break;
      }
    }else if(fieldToSort === "roleName"){
      this.showNameFilter = 0;
      this.showProvinceFilter = 0;
      this.showPhoneFilter = 0;
      this.showEmailFilter = 0;
      switch (this.showRoleFilter){
        case 0: this.showRoleFilter = 1; direction = "desc"; break;
        case 1: this.showRoleFilter = 2; direction = "asc"; break;
        case 2: this.showRoleFilter = 0; direction = ""; break;
      }
    }else if(fieldToSort === "user.province"){
      this.showNameFilter = 0;
      this.showRoleFilter = 0;
      this.showPhoneFilter = 0;
      this.showEmailFilter = 0;
      switch (this.showProvinceFilter){
        case 0: this.showProvinceFilter = 1; direction = "desc"; break;
        case 1: this.showProvinceFilter = 2; direction = "asc"; break;
        case 2: this.showProvinceFilter = 0; direction = ""; break;
      }
    }else if(fieldToSort === "user.phoneNumber"){
      this.showNameFilter = 0;
      this.showRoleFilter = 0;
      this.showProvinceFilter = 0;
      this.showEmailFilter = 0;
      switch (this.showPhoneFilter){
        case 0: this.showPhoneFilter = 1; direction = "desc"; break;
        case 1: this.showPhoneFilter = 2; direction = "asc"; break;
        case 2: this.showPhoneFilter = 0; direction = ""; break;
      }
    }else if(fieldToSort === "user.emailAddress"){
      this.showNameFilter = 0;
      this.showRoleFilter = 0;
      this.showProvinceFilter = 0;
      this.showPhoneFilter = 0;
      switch (this.showEmailFilter){
        case 0: this.showEmailFilter = 1; direction = "desc"; break;
        case 1: this.showEmailFilter = 2; direction = "asc"; break;
        case 2: this.showEmailFilter = 0; direction = ""; break;
      }
    }
    this.sortUserList.emit([fieldToSort, direction]);
    this.groupService.shouldReloadPaginationPagesNumbers(true);
  }


  saveEditMember() {
    console.log("have core details changed?: ", this.coreDetailsChanged);

    let memberUid = this.singleMemberManage.user.uid.toString();
    let name = this.editMemberForm.controls['displayName'].value;
    let email = this.editMemberForm.controls['memberEmail'].value;
    let phone = this.editMemberForm.controls['phoneNumber'].value;
    let province = this.editMemberForm.controls['province'].value;

    let shouldReload = false;

    this.editComplete.subscribe(succeeded => {
      console.log("finished? ", succeeded);
      this.clearEditModal();
      this.alertService.alert("group.allMembers.edit.completed");
      this.shouldReloadList.emit(succeeded);
    });

    if(!this.coreDetailsChanged && !this.roleChanged && !this.withinGroupAttrsChanged){
      console.log("Nothing changed in form not submiting it");
      this.clearEditModal();
      return;
    }

    if (this.roleChanged) {
      this.groupService.updateGroupMemberRole(this.group.groupUid, memberUid,
        this.editMemberForm.controls['roleName'].value).subscribe(resp => {
        console.log("edit copmlete, emitting true");
        this.editComplete.emit(true);
      })
    }

    if (this.coreDetailsChanged) {
      this.groupService.updateGroupMemberDetails(this.group.groupUid, memberUid, name, email, phone, province)
        .subscribe(resp => {
          console.log(resp);
          this.editComplete.emit(true);
        })
    }

    console.log("multi select options: ", this.editMemberForm.controls['taskTeams']);
    console.log("stashed task teams: ", this.currentTaskTeams);
    if (this.withinGroupAttrsChanged) {
      let taskTeams = this.editMemberForm.controls['taskTeams'].pristine ?
        this.currentTaskTeams : this.editMemberForm.controls['taskTeams'].value;
      console.log("task team values to submit: ", taskTeams);
      console.log("and affiliations: ", this.splitAffiliations());

      let topics = this.editMemberForm.controls['topics'].pristine ?
        this.singleMemberManage.topics : this.editMemberForm.controls['topics'].value;
      console.log("topics: ", topics);

      this.groupService.updateGroupMemberAssignments(this.group.groupUid, memberUid, taskTeams, this.splitAffiliations(), topics)
        .subscribe(resp => {
          this.editComplete.emit(true);
        });
    }

    if (shouldReload) {

      this.clearEditModal();
    }

    return false;
  }

  private clearEditModal() {
    $('#member-edit-modal').modal('hide');
    this.singleMemberManage = null;
    this.roleChanged = false;
    this.coreDetailsChanged = false;
    this.withinGroupAttrsChanged = false;
    this.currentTaskTeams = [];
    Object.keys(this.editMemberForm.controls).forEach(field => {
      this.editMemberForm.controls[field].markAsPristine({onlySelf: true});
      this.editMemberForm.controls[field].markAsUntouched({onlySelf: false});
    });
  }

  private splitAffiliations(): string[] {
    if (this.editMemberForm.controls['affiliations'].pristine) {
      return this.singleMemberManage.affiliations;
    }

    if (this.editMemberForm.controls['affiliations'].value) {
      return this.editMemberForm.controls['affiliations'].value.split(", ").map(s => s.trim());
    }

    return [];
  }

}
