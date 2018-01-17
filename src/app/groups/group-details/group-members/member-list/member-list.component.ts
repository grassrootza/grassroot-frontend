import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Membership, MembersPage} from '../../../model/membership.model';
import {GroupService} from '../../../group.service';
import {Group} from '../../../model/group.model';
import {GroupRef} from '../../../model/group-ref.model';

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

  singleMemberManage: Membership = null;
  selectedTaskTeam: GroupRef = null;
  selectedTopics: string[] = [];

  constructor(private groupService: GroupService) {
    this.memberRemoved = new EventEmitter<any>();
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

}
