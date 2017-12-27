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

  addMemberToTaskTeam: Membership = null;
  selectedTaskTeam: GroupRef = null;

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
      this.addMemberToTaskTeam = member;
      $('#add-member-to-task-team').modal('show');
    }else{
      $('#no-task-teams-for-group').modal('show');
    }
  }

  selectTaskTeam(taskTeam: GroupRef){
    this.selectedTaskTeam = taskTeam;
    $('#add-member-to-task-team-dropdown-button').html(taskTeam.name);
  }

  saveAddMemberToTaskTeam(){
    let memberUids: string[] = [];
    memberUids.push(this.addMemberToTaskTeam.user.uid.toString());
    this.groupService.addMembersToTaskTeam(this.group.groupUid, this.selectedTaskTeam.groupUid, memberUids).subscribe(response => {
      $('#add-member-to-task-team').modal('hide');
    })
  }

}
