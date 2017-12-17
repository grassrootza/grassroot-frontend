import {Component, OnInit} from '@angular/core';
import {Group} from "../../../model/group.model";
import {ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../../../user/user.service";
import {GroupService} from "../../../group.service";

@Component({
  selector: 'app-group-all-members',
  templateUrl: './group-all-members.component.html',
  styleUrls: ['./group-all-members.component.css']
})
export class GroupAllMembersComponent implements OnInit {


  public group: Group = null;

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


}
