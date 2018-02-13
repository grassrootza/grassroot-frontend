import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Group} from "../../../model/group.model";
import {UserService} from "../../../../user/user.service";
import {GroupService} from "../../../group.service";
import {MembersPage} from "../../../model/membership.model";
import {GroupRef} from "../../../model/group-ref.model";
import {AlertService} from "../../../../utils/alert.service";

declare var $:any;

@Component({
  selector: 'app-group-task-teams',
  templateUrl: './group-task-teams.component.html',
  styleUrls: ['./group-task-teams.component.css']
})
export class GroupTaskTeamsComponent implements OnInit {

  public group: Group = null;
  public selectedSubGroup: Group = null;
  public currentPage: MembersPage = null;

  public editingName: boolean = false;
  public editedName: string = "";

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService,
              private alertService: AlertService) { }

  ngOnInit() {

    this.route.parent.parent.params.subscribe((params: Params) => {
      let groupUid = params['id'];
      this.loadGroup(groupUid);
    });
  }

  loadGroup(groupUid: string) {
    this.groupService.loadGroupDetailsCached(groupUid, true)
      .subscribe(
        groupDetails => {
          this.group = groupDetails;
        },
        error => {
          console.log("Error loading group", error.status)
        }
      );
  }

  loadMembers(taskTeamUid: string, reloadParent: boolean = false) {
    this.alertService.showLoading();
    this.groupService.loadTaskTeamDetails(this.group.groupUid, taskTeamUid).subscribe(subgroup => {
      this.selectedSubGroup = subgroup;
      this.loadMembersPage(0, []);
      if (reloadParent) {
        this.loadGroup(this.group.groupUid);
      }
    });
  }

  loadMembersPage(pageNo: number, sort: string []) {
    this.groupService.fetchGroupMembers(this.selectedSubGroup.groupUid, pageNo, 10, sort)
      .subscribe(
        result => {
          this.currentPage = result;
          this.alertService.hideLoading();
        }, error => {
          console.log("Failed to load group members: ", error);
          this.currentPage = null;
          this.alertService.hideLoading();
        }
      );
  }

  showCreateTaskTeamModal(){
    $("#create-task-team-modal").modal("show");
  }

  closeModal(){
    $("#create-task-team-modal").modal("hide");
    this.alertService.alert("group.taskTeam.createTeamDone");
    this.loadGroup(this.group.groupUid);
  }

  initiateTaskTeamRemoval() {
    $("#confirm-task-team-removal").modal("show");
  }

  initiateTaskTeamRename() {
    this.editedName = this.selectedSubGroup.name;
    this.editingName = true;
  }

  cancelTaskTeamRename() {
    this.editedName = "";
    this.editingName = false;
  }

  confirmTaskTeamRename() {
    let newName = this.editedName;
    this.groupService.renameTaskTeam(this.group.groupUid, this.selectedSubGroup.groupUid, newName).subscribe(result => {
      this.selectedSubGroup.name = newName;
      this.editingName = false;
      this.editedName = "";
      this.groupService.loadGroupDetailsFromServer(this.group.groupUid).subscribe(group => {
        this.group = group;
      })
    }, error =>{
      console.log("well that didn't work");
    })
  }

  confirmTaskTeamRemoval() {
    console.log("selected sub group: ", this.selectedSubGroup);
    this.groupService.removeTaskTeam(this.group.groupUid, this.selectedSubGroup.groupUid).subscribe(group => {
      this.selectedSubGroup = null;
      this.group = group;
      $("#confirm-task-team-removal").modal("hide");
      this.alertService.alert("group.taskTeam.removeTeamDone");
    }, error => {
      console.log("well, that didn't work, show an alert");
      $("#confirm-task-team-removal").modal("hide");
    })
  }
}
