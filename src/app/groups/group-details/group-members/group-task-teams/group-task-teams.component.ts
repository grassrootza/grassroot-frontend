import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Group} from "../../../model/group.model";
import {UserService} from "../../../../user/user.service";
import {GroupService} from "../../../group.service";
import {MembersPage} from "../../../model/membership.model";
import {GroupRef} from "../../../model/group-ref.model";

declare var $:any;

@Component({
  selector: 'app-group-task-teams',
  templateUrl: './group-task-teams.component.html',
  styleUrls: ['./group-task-teams.component.css']
})
export class GroupTaskTeamsComponent implements OnInit {

  public group: Group = null;
  public selectedSubGroup: GroupRef = null;
  public currentPage: MembersPage = null;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService) {
  }

  ngOnInit() {

    this.route.parent.parent.params.subscribe((params: Params) => {
      let groupUid = params['id'];

      console.log("calling group fetch in task teams");
      this.groupService.loadGroupDetailsCached(groupUid, true)
        .subscribe(
          groupDetails => {
            this.group = groupDetails;
          },
          error => {
            console.log("Error loading groups", error.status)
          }
        );
    });
  }

  loadMembers(group: GroupRef) {
    this.selectedSubGroup = group;
    this.loadMembersPage(0, []);
  }

  loadMembersPage(pageNo: number, sort: string []) {
    this.groupService.fetchGroupMembers(this.selectedSubGroup.groupUid, pageNo, 10, sort)
      .subscribe(
        result => this.currentPage = result,
        error => {
          console.log("Failed to load group members: ", error);
          this.currentPage = null;
        }
      );
  }

  showCreateTaskTeamModal(){
    $("#create-task-team-modal").modal("show");
  }

  closeModal(){
    $("#create-task-team-modal").modal("hide");
  }

  initiateTaskTeamRemoval() {
    $("#confirm-task-team-removal").modal("show");
  }

  confirmTaskTeamRemoval() {
    console.log("selected sub group: ", this.selectedSubGroup);
    this.groupService.removeTaskTeam(this.group.groupUid, this.selectedSubGroup.groupUid).subscribe(group => {
      this.selectedSubGroup = null;
      this.group = group;
      $("#confirm-task-team-removal").modal("hide");
    }, error => {
      console.log("well, that didn't work, show an alert");
      $("#confirm-task-team-removal").modal("hide");
    })
  }
}
