import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {saveAs} from 'file-saver';
import {UserService} from '../../../../user/user.service';
import {GroupService} from '../../../group.service';
import {Membership, MembersPage} from '../../../model/membership.model';
import {Group} from '../../../model/group.model';
import {AlertService} from "../../../../utils/alert-service/alert.service";
import {MemberTopicsManageComponent} from "../member-topics-manage/member-topics-manage.component";
import {GroupInfo} from "../../../model/group-info.model";
import {getCreateModalId} from "../../../../task/task-type";

declare var $: any;

@Component({
  selector: 'app-group-all-members',
  templateUrl: './group-all-members.component.html',
  styleUrls: ['./group-all-members.component.css']
})
export class GroupAllMembersComponent implements OnInit {

  @ViewChild('bulkMemberManageModal')
  private bulkTopicManage: MemberTopicsManageComponent;

  public currentPage:MembersPage = new MembersPage(0,0, 0,0, true, false, []);
  private groupUid: string = '';
  public group: Group = null;
  bulkSelectedTopics: string[] = [];

  bulkManageMembers: Membership[] = [];
  bulkMemberUids: string[] = [];
  filterMembersPage: string[] = [];
  groupsToCopyMembersTo: GroupInfo[] = [];

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService,
              private alertService: AlertService) {
    // console.log("constructing all members component");
  }

  ngOnInit() {
    console.log("initiating all members component");
    this.route.parent.parent.params.subscribe((params: Params) => {
      this.groupUid = params['id'];
      this.groupService.loadGroupDetailsCached(this.groupUid, false)
        .subscribe(
          groupDetails => {
            // console.log("got a result on group details: ", groupDetails);
            this.group = groupDetails;
          },
          error => {
            console.log("Error loading groups", error.status)
          }
        );
      this.goToPage(0, []);
    });

    this.groupService.groupMemberAdded.subscribe(success => {
      if(success) {
        this.goToPage(0, []);
        this.groupService.groupMemberAddedSuccess(false);
      }
    })
  }


  goToPage(page: number, sort: string[]){
    if (!this.currentPage) {
      this.alertService.showLoading();
    }
    // console.log("sorting users, retrieved sort: ", sort);
    this.filterMembersPage = sort;
    this.groupService.fetchGroupMembers(this.groupUid, page, 10, sort).subscribe(
        membersPage => {
          this.currentPage = membersPage;
          this.alertService.hideLoading();
        },
        error => {
          this.alertService.hideLoading();
          // console.log('Error loading group members', error.status);
        }
      )
  }

  showBulkAssignTopicsModal(){
    if(this.bulkManageCheckNumberOfSelectedMembers() == 0){
      $('#bulk-manage-no-members-selected').modal('show');
    } else {
      this.bulkMemberUids = this.bulkManageMembers.map(member => member.user.uid);
      this.bulkSelectedTopics = this.group.topics.filter(topic => {
        // js type weirdness makes this unpredictable if made into more elegant single line
        let topicsContained = this.bulkManageMembers.map(member => member.topics.indexOf(topic) != -1);
        return topicsContained.reduce((prior, current) => prior && current);
      });
      this.bulkTopicManage.setupTopicSelect(this.bulkSelectedTopics);
      $('#bulk-member-assign-topics').modal('show');
    }
  }


  showBulkAddToTaskTeamModal(){
    if(this.bulkManageCheckNumberOfSelectedMembers() == 0){
      $('#bulk-manage-no-members-selected').modal('show');
    } else {
      console.log("bulk manage members: ", this.bulkManageMembers);
      $('#bulk-add-to-task-team').modal('show');
    }
  }

  showBulkCopyToGroupModal(){
    if(this.bulkManageCheckNumberOfSelectedMembers() == 0){
      $('#bulk-manage-no-members-selected').modal('show');
    } else {
      console.log("copy members to group: ", this.bulkManageMembers);
      this.groupService.groupInfoList.subscribe(groups => {
        this.groupsToCopyMembersTo = groups.filter(g => g.hasPermission("GROUP_PERMISSION_ADD_GROUP_MEMBER")
          && g.groupUid !== this.group.groupUid);
        $('#bulk-copy-members-to-group').modal('show');
      });

    }
  }

  showCreateTaskModal(taskType: string) {
    this.bulkMemberUids = this.bulkManageMembers.map(member => member.user.uid);
    $("#" + getCreateModalId(taskType)).modal('show');
  }

  goToFirstPage() {
    this.goToPage(0, []);
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
      this.goToPage(0, []);
    });
  }

  memberRemoved(){
    this.goToPage(0, []);
  }

  bulkManageCheckNumberOfSelectedMembers(): number{
    this.bulkManageMembers = this.currentPage.getSelectedMembers();
    return this.bulkManageMembers.length;
  }

  downloadErrorReport() {
    this.groupService.downloadErrorReport(this.groupUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      saveAs(blob, "error-report.xlsx");
    }, error => {
      console.log("error getting the file: ", error);
    });
  }

  taskCreated(saveResponse, type: string) {
    console.log(saveResponse);
    $("#" + getCreateModalId(type)).modal("hide");
  }

}
