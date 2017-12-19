import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {Group} from "../../../model/group.model";
import {UserService} from "../../../../user/user.service";
import {GroupService} from "../../../group.service";
import {MembersPage} from "../../../model/membership.model";
import {GroupRef} from "../../../model/group-ref.model";

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
      this.groupService.loadGroupDetails(groupUid)
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
    });
  }

  loadMembers(group: GroupRef) {
    this.selectedSubGroup = group;
    this.loadMembersPage(0);
  }


  loadMembersPage(pageNo: number) {
    this.groupService.fetchGroupMembers(this.selectedSubGroup.groupUid, pageNo, 10)
      .subscribe(
        result => this.currentPage = result,
        error => console.log("Failed to load group members: ", error)
      );
  }
}
