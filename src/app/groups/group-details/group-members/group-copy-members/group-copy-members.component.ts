import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
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
export class GroupCopyMembersComponent implements OnInit, OnChanges {

  @Input() modalId: string = "add-member-to-task-team";
  @Input() groups: GroupInfo[] = [];
  @Input() members: Membership[] = null;

  @Output() membersAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedGroup: Group = null;

  createNewGroup: boolean = false;
  newGroupName: string = "";

  constructor(private groupService: GroupService,
              private alertService: AlertService) { }

  ngOnInit() {
    console.log("fired up copy members modal");
  }

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
      this.saveCopyMemberToGroup();
    }
  }

  saveCopyMemberToGroup(groupUid: string = null){
    let groupAddMemberInfo: GroupAddMemberInfo[] = [];
    console.log("copying members into group, currently: ", this.members);
    this.members.forEach(member => {
      const memberInfo = new GroupAddMemberInfo(
        member.user.phoneNumber,
        member.user.displayName,
        member.user.firstName,
        member.user.lastName,
        GroupRole.ROLE_ORDINARY_MEMBER,
        member.user.email,
        UserProvince[member.user.province],
        member.affiliations,
        [],
        member.topics
      );
      groupAddMemberInfo.push(memberInfo);
    });
    console.log("after transformation, members to copy in: ", groupAddMemberInfo);
    this.groupService.confirmAddMembersToGroup(groupUid ? groupUid : this.selectedGroup.groupUid, groupAddMemberInfo, "COPIED_INTO_GROUP").subscribe(resp => {
      console.log(resp);
      this.alertAndCleanUp("group.allMembers.copyMembers.addedDone");
    }, error => {
      this.alertAndCleanUp("group.allMembers.copyMembers.error");
    });

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
