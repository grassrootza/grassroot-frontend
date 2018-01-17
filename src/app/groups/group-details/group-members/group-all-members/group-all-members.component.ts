import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../../../user/user.service';
import {GroupService} from '../../../group.service';
import {Membership, MembersPage} from '../../../model/membership.model';
import {Group} from '../../../model/group.model';
import {GroupRef} from '../../../model/group-ref.model';

declare var $: any;


@Component({
  selector: 'app-group-all-members',
  templateUrl: './group-all-members.component.html',
  styleUrls: ['./group-all-members.component.css']
})
export class GroupAllMembersComponent implements OnInit {


  public currentPage:MembersPage = new MembersPage(0,0, 0,0, true, false, []);
  private groupUid: string = '';
  public group: Group = null;
  selectedTaskTeam: GroupRef = null;
  selectedTopics: string[] = [];

  bulkManageMembers: Membership[] = [];

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService) {
  }

  ngOnInit() {

    this.route.parent.parent.params.subscribe((params: Params) => {
      this.groupUid = params['id'];
      this.groupService.loadGroupDetails(this.groupUid)
        .subscribe(
          groupDetails => {
            this.group = groupDetails;
          },
          error => {
            if (error.status = 401)
              this.userService.logout();
            console.log("Error loading groups", error.status)
          }
        );
      this.goToPage(0);
    });
  }


  goToPage(page: number){
    this.groupService.fetchGroupMembers(this.groupUid, page, 10)
      .subscribe(
        membersPage => {
          console.log(membersPage);
          this.currentPage = membersPage;
        },
        error => {
          if (error.status = 401)
            this.userService.logout();
          console.log('Error loading group members', error.status);
        }
      )
  }

  showBulkAssignTopicsModal(){
    if(this.bulkManageCheckNumberOfSelectedMembers() == 0){
      $('#bulk-manage-no-members-selected').modal('show');
    }else if(this.group.topics.length == 0){
      $('#no-task-teams-for-group').modal('show');
    }else{
      $('#bulk-member-assign-topics').modal('show');
    }
  }


  showBulkAddToTaskTeamModal(){
    if(this.bulkManageCheckNumberOfSelectedMembers() == 0){
      $('#bulk-manage-no-members-selected').modal('show');
    }else if(this.group.subGroups.length == 0){
      $('#no-topics-for-group').modal('show');
    }else{
      $('#bulk-add-members-to-task-team-modal').modal('show');
    }
  }

  selectTaskTeam(taskTeam: GroupRef){
    this.selectedTaskTeam = taskTeam;
    $('#add-member-to-task-team-dropdown-button').html(taskTeam.name);
  }

  saveAddMembersToTaskTeam(){
    let memberUids: string[] = [];
    this.bulkManageMembers.forEach(m => {
      memberUids.push(m.user.uid.toString());
    });
    this.groupService.addMembersToTaskTeam(this.group.groupUid, this.selectedTaskTeam.groupUid, memberUids).subscribe(response => {
      $('#bulk-add-members-to-task-team-modal').modal('hide');
      this.goToPage(0);
    })
  }

  bulkSaveAssignTopicToMember(){
    let memberUids: string[] = [];
    this.bulkManageMembers.forEach(m => {
      memberUids.push(m.user.uid.toString());
    });
    this.groupService.assignTopicToMember(this.group.groupUid, memberUids, this.selectedTopics).subscribe(response => {
      $('#bulk-member-assign-topics').modal('hide');
      this.goToPage(0);
    })
  }


  showBulkRemoveModal(){
    if(this.bulkManageCheckNumberOfSelectedMembers() > 0){
      $('#bulk-remove-members-modal').modal('show');
    }else{
      $('#bulk-manage-no-members-selected').modal('show');
    }
  }


  removeSelectedMembers(){
    let memberUids:string[] = [];
    this.bulkManageMembers.forEach(m => memberUids.push(m.user.uid.toString()));
    this.groupService.removeMembers(this.groupUid, memberUids).subscribe(response => {
      $('#bulk-remove-members-modal').modal('hide');
      this.goToPage(0);
    });
  }

  memberRemoved(){
    this.goToPage(0);
  }

  bulkManageCheckNumberOfSelectedMembers(): number{
    let numberOfSelected: number = 0;
    this.bulkManageMembers = [];
    this.currentPage.content.forEach(m => {
      if(m.selected){
        numberOfSelected ++;
        this.bulkManageMembers.push(m);
      }
    });
    return numberOfSelected;
  }

}
