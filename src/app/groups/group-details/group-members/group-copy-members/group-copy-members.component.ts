import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {Group} from "../../../model/group.model";
import {Membership} from "../../../model/membership.model";
import {GroupService} from "../../../group.service";
import {AlertService} from "../../../../utils/alert-service/alert.service";
import {GroupInfo} from "../../../model/group-info.model";
import {GroupAddMemberInfo} from "../../../model/group-add-member-info.model";
import {GroupRole} from "../../../model/group-role";
import {UserProvince} from "../../../../user/model/user-province.enum";

declare var $: any;

@Component({
  selector: 'app-group-copy-members',
  templateUrl: './group-copy-members.component.html',
  styleUrls: ['./group-copy-members.component.css']
})
export class GroupCopyMembersComponent implements OnChanges {

  @Input() modalId: string = "add-member-to-task-team";
  @Input() groups: GroupInfo[] = [];
  @Input() members: Membership[] = null;
  @Input() fromGroupUid: string = '';
  @Input() applyToAllMembers: boolean = false;

  @Output() membersAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedGroup: Group = null;

  createNewGroup: boolean = false;
  newGroupName: string = "";
  topicAssignment: string = "";

  constructor(private groupService: GroupService,
              private alertService: AlertService) { }

  ngOnChanges() {
    // console.log("add to task team changed, members now: ", this.members);
  }

  toggleCreateNewGroup() {
    this.createNewGroup = !this.createNewGroup;
  }

  performCopy() {
    if (this.createNewGroup) {
      // can take a bit longer, hence
      this.alertService.showLoading();
      this.groupService.createGroup(this.newGroupName).subscribe(group => {
        this.saveCopyMemberToGroup(group.groupUid);
      }, error2 => {
        console.log("error creating new group, error body: ", error2);
        this.alertAndCleanUp("group.allMembers.copyMembers.error");
      })
    } else {
      this.saveCopyMemberToGroup(this.selectedGroup.groupUid);
    }
  }

  saveCopyMemberToGroup(groupUid: string = null) {
    if (this.applyToAllMembers)
      this.transferAllMembers(groupUid)
    else
      this.transferSelectedMembers(groupUid);
  }

  transferSelectedMembers(groupUid: string) {
    let groupAddMemberInfo: GroupAddMemberInfo[] = [];
    // console.log("copying members into group, currently: ", this.members);
    
    this.members.forEach(member => {
      let newGroupTopics = this.topicAssignment ? member.topics.concat(this.topicAssignment) : member.topics;
      const memberInfo = new GroupAddMemberInfo(
        member.phoneNumber,
        member.displayName, '', '',
        GroupRole.ROLE_ORDINARY_MEMBER,
        member.emailAddress,
        UserProvince[member.province],
        member.affiliations,
        [],
        newGroupTopics
      );
      groupAddMemberInfo.push(memberInfo);
    });
    // console.log("after transformation, members to copy in: ", groupAddMemberInfo);
    this.groupService.confirmAddMembersToGroup(groupUid ? groupUid : this.selectedGroup.groupUid, groupAddMemberInfo, "COPIED_INTO_GROUP").subscribe(resp => {
      // console.log(resp);
      this.alertAndCleanUp("group.allMembers.copyMembers.addedDone");
    }, () => {
      this.alertAndCleanUp("group.allMembers.copyMembers.error");
    });
  }

  transferAllMembers(groupUid: string) {
     this.groupService.copyMembersFromGroupToOther(this.fromGroupUid, groupUid, true, this.topicAssignment).subscribe(() => {
       this.alertAndCleanUp('group.allMembers.copyMembers.addedDone');
     }, error => {
       console.log('error copying all: ', error);
       this.alertAndCleanUp('group.allMembers.copyMembers.error');
     })
  }

   alertAndCleanUp(alertMessage: string) {
    this.alertService.hideLoading();
    if (alertMessage) {
      this.alertService.alert(alertMessage);
    }
    $('#' + this.modalId).modal('hide');
    this.membersAdded.emit(true);
    this.resetValues();
  }

  cancelOrClose() {
    console.log("exiting, reseting");
    this.resetValues();
    $('#' + this.modalId).modal('hide');
  }

  resetValues() {
    this.selectedGroup = null;
    this.createNewGroup = false;
    this.members = [];
  }

}
