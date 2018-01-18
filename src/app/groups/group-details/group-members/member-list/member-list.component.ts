import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Membership, MembersPage} from '../../../model/membership.model';
import {GroupService} from '../../../group.service';
import {Group} from '../../../model/group.model';
import {GroupRef} from '../../../model/group-ref.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {emailOrPhoneEntered, optionalEmailValidator, optionalPhoneValidator} from '../../../../utils/CustomValidators';
import {GroupAddMemberInfo} from '../../../model/group-add-member-info.model';
import {GroupRole} from '../../../model/group-role';
import {UserProvince} from '../../../../user/model/user-province.enum';
import {Observable} from 'rxjs/Observable';
import {GroupRelatedUserResponse} from '../../../model/group-related-user.model';

declare var $: any;

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  @Input()
  public currentPage: MembersPage = null;

  @Input()
  public group: Group = null;

  @Output()
  memberRemoved: EventEmitter<any>;

  @Output()
  shouldReloadList: EventEmitter<boolean>;

  @Output()
  sortUserList: EventEmitter<string[]>;

  showNameFilter: number = 0;
  showRoleFilter: number = 0;
  showProvinceFilter: number = 0;
  showPhoneFilter: number = 0;
  showEmailFilter: number = 0;

  singleMemberManage: Membership = null;
  selectedTaskTeam: GroupRef = null;
  selectedTopics: string[] = [];

  public editMemberForm: FormGroup;
  province = UserProvince;
  provinceKeys: string[];
  role = GroupRole;
  roleKeys: string[];
  public roleChanged:boolean = false;
  public detailsChanged: boolean = false;

  constructor(private groupService: GroupService,
              private fb: FormBuilder) {
    this.memberRemoved = new EventEmitter<any>();
    this.shouldReloadList = new EventEmitter<boolean>();
    this.sortUserList = new EventEmitter<string[]>();
    this.editMemberForm = fb.group(new GroupAddMemberInfo(), { validator: emailOrPhoneEntered("emailAddress", "memberMsisdn")});
    this.provinceKeys = Object.keys(this.province);
    this.roleKeys = Object.keys(GroupRole);
    this.setupValidation();
  }

  private setupValidation() {
    this.editMemberForm.controls['displayName'].setValidators([Validators.required]);
    this.editMemberForm.controls['roleName'].setValidators([Validators.required]);
    this.editMemberForm.controls['emailAddress'].setValidators(optionalEmailValidator);
    this.editMemberForm.controls['memberMsisdn'].setValidators(optionalPhoneValidator);
  }

  ngOnInit() {
  }

  selectMember(member: Membership) {
    member.selected = true;
  }

  public selectAllOnPage(event): void {
    let target = event.target || event.srcElement || event.currentTarget;
    let shouldSelectAll = target.checked;

    this.currentPage.content.forEach(m => m.selected = shouldSelectAll);
  }

  removeMember(memberUid: string){
    let groupUid = this.currentPage.content[0].group.groupUid;
    let memberUids: string[] = [];
    memberUids.push(memberUid);
    this.groupService.removeMembers(groupUid, memberUids).subscribe(response => {
      this.memberRemoved.emit();
    })
  }

  showAddMemberToTaskTeamModal(member: Membership){
    if(this.group.subGroups.length > 0){
      this.singleMemberManage = member;
      $('#add-member-to-task-team').modal('show');
    }else{
      $('#no-task-teams-for-group').modal('show');
    }
  }

  showAssignTopicToMemberModal(member: Membership){
    if(this.group.topics.length > 0){
      this.singleMemberManage = member;
      this.selectedTopics = [];
      for(let i=0;i<member.topics.length;i++){
        this.selectedTopics.push(member.topics[i]);
      }
      $('#member-assign-topics').modal('show');
    }else{
      $('#no-topics-for-group').modal('show');
    }
  }

  showEditModal(member: Membership){
    if(member.canEditDetails){
      $('#member-edit-modal').modal('show');
      this.editMemberForm.controls['displayName'].setValue(member.user.displayName);
      let role = "";
      if(member.roleName === "Member")
        role = "ROLE_ORDINARY_MEMBER";
      else if(member.roleName === "Committee")
        role = "ROLE_COMMITTEE_MEMBER";
      else
        role = "ROLE_GROUP_ORGANIZER";
      this.editMemberForm.controls['roleName'].setValue(role);
      this.editMemberForm.controls['memberMsisdn'].setValue(member.user.phoneNumber != null ? member.user.phoneNumber : "");
      this.editMemberForm.controls['emailAddress'].setValue(member.user.email != null ? member.user.email : "");
      this.editMemberForm.controls['province'].setValue(member.user.province);
      this.editMemberForm.controls['affiliations'].setValue(member.affiliations.join(","));

      this.singleMemberManage = member;

    }else{
      $('#cant-edit-details').modal('show');
    }
  }

  selectTaskTeam(taskTeam: GroupRef){
    this.selectedTaskTeam = taskTeam;
    $('#add-member-to-task-team-dropdown-button').html(taskTeam.name);
  }

  saveAddMemberToTaskTeam(){
    let memberUids: string[] = [];
    memberUids.push(this.singleMemberManage.user.uid.toString());
    this.groupService.addMembersToTaskTeam(this.group.groupUid, this.selectedTaskTeam.groupUid, memberUids).subscribe(response => {
      $('#add-member-to-task-team').modal('hide');
    })
  }

  saveAssignTopicToMember(){
    let memberUids: string[] = [];
    memberUids.push(this.singleMemberManage.user.uid.toString());
    this.groupService.assignTopicToMember(this.group.groupUid, memberUids, this.selectedTopics).subscribe(response => {
      $('#member-assign-topics').modal('hide');
    })
  }

  roleChangedTrigger(){
    this.roleChanged = true;
  }

  detailsChangedTrigger(){
    this.detailsChanged = true;
  }

  filterData(fieldToFilter: string){
    let direction = "";
    if(fieldToFilter === "user.displayName"){
      this.showRoleFilter = 0;
      this.showProvinceFilter = 0;
      this.showPhoneFilter = 0;
      this.showEmailFilter = 0;
      switch (this.showNameFilter){
        case 0: this.showNameFilter = 1; direction = "desc"; break;
        case 1: this.showNameFilter = 2; direction = "asc"; break;
        case 2: this.showNameFilter = 0; direction = ""; break;
      }
    }else if(fieldToFilter === "roleName"){
      this.showNameFilter = 0;
      this.showProvinceFilter = 0;
      this.showPhoneFilter = 0;
      this.showEmailFilter = 0;
      switch (this.showRoleFilter){
        case 0: this.showRoleFilter = 1; direction = "desc"; break;
        case 1: this.showRoleFilter = 2; direction = "asc"; break;
        case 2: this.showRoleFilter = 0; direction = ""; break;
      }
    }else if(fieldToFilter === "user.province"){
      this.showNameFilter = 0;
      this.showRoleFilter = 0;
      this.showPhoneFilter = 0;
      this.showEmailFilter = 0;
      switch (this.showProvinceFilter){
        case 0: this.showProvinceFilter = 1; direction = "desc"; break;
        case 1: this.showProvinceFilter = 2; direction = "asc"; break;
        case 2: this.showProvinceFilter = 0; direction = ""; break;
      }
    }else if(fieldToFilter === "user.phoneNumber"){
      this.showNameFilter = 0;
      this.showRoleFilter = 0;
      this.showProvinceFilter = 0;
      this.showEmailFilter = 0;
      switch (this.showPhoneFilter){
        case 0: this.showPhoneFilter = 1; direction = "desc"; break;
        case 1: this.showPhoneFilter = 2; direction = "asc"; break;
        case 2: this.showPhoneFilter = 0; direction = ""; break;
      }
    }else if(fieldToFilter === "user.emailAddress"){
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
    this.sortUserList.emit([fieldToFilter, direction]);
    this.groupService.shouldReloadPaginationPagesNumbers(true);
  }


  saveEditMember() {
    console.log("okay, posting member ...");
    if(this.editMemberForm.controls['affiliations'].value != null){
      let affiliations = this.editMemberForm.controls['affiliations'].value.split(",");
      this.editMemberForm.controls['affiliations'].setValue(affiliations);
    }
    let memberUid = this.singleMemberManage.user.uid.toString();
    let name = this.editMemberForm.controls['displayName'].value;
    let email = this.editMemberForm.controls['emailAddress'].value;
    let phone = this.editMemberForm.controls['memberMsisdn'].value;
    let province = this.editMemberForm.controls['province'].value;

    if(this.roleChanged){
      this.groupService.updateGroupMemberRole(this.group.groupUid, memberUid,
        this.editMemberForm.controls['roleName'].value).subscribe(resp => {

        this.roleChanged = false;

        if(this.detailsChanged){

          this.groupService.updateGroupMemberDetails(this.group.groupUid, memberUid, name, email, phone, province)
            .subscribe(resp => {
              console.log(resp);
              this.detailsChanged = false;
            })
        }
        this.shouldReloadList.emit(true);
        $('#member-edit-modal').modal('hide');
        this.singleMemberManage = null;
      })
    }else if(this.detailsChanged && !this.roleChanged){
      this.groupService.updateGroupMemberDetails(this.group.groupUid, memberUid, name, email, phone, province)
        .subscribe(resp => {
          console.log(resp);
          this.detailsChanged = false;
          $('#member-edit-modal').modal('hide');
          this.singleMemberManage = null;
          this.shouldReloadList.emit(true);
        })
    }else if(!this.detailsChanged && !this.roleChanged){
      console.log("Nothing changed in form not submiting it");
      $('#member-edit-modal').modal('hide');
      this.singleMemberManage = null;
    }
  }

}
