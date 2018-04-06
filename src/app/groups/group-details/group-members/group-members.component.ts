import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {GroupService} from "../../group.service";
import {UserService} from "../../../user/user.service";
import {Group} from "../../model/group.model";
import {AlertService} from "../../../utils/alert-service/alert.service";

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.css']
})
export class GroupMembersComponent implements OnInit {

  public currentTab: string = "all";
  public group: Group = null;
  public groupUid: string = ""; // as need for input (and group is null on init)

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService,
              private alertService: AlertService) {

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.currentTab = ev.urlAfterRedirects.substring(ev.urlAfterRedirects.lastIndexOf("/") + 1);
      }
    });
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      let groupUid = params['id'];
      this.loadGroup(groupUid);
    });
  }

  loadGroup(groupUid: string = "") {
    let id = (groupUid) ? groupUid : this.group.groupUid;
    this.groupService.loadGroupDetailsCached(id, false)
      .subscribe(
        groupDetails => {
          this.group = groupDetails;
          this.groupUid = this.group.groupUid;
        },
        error => {
          console.log("Error loading groups", error.status)
        }
      );
  }

  onMemberAdded() {
    this.loadGroup();
    this.groupService.groupMemberAddedSuccess(true);
    this.alertService.alert("group.allMembers.addMember.complete");
  }

  onMemberFailed() {
    console.log("that went wrong");
    this.alertService.alert("group.allMembers.addMember.failed");
  }

}
