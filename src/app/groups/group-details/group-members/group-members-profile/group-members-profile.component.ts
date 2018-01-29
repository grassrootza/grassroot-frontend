import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {GroupService} from '../../../group.service';
import {UserService} from '../../../../user/user.service';
import {Membership} from '../../../model/membership.model';
import {GroupMemberActivity} from '../../../model/group-member-activity';

@Component({
  selector: 'app-group-members-profile',
  templateUrl: './group-members-profile.component.html',
  styleUrls: ['./group-members-profile.component.css']
})
export class GroupMembersProfileComponent implements OnInit {

  public memberUid: string = "";
  public groupUid: string = "";
  public member: Membership = null;
  public activities: GroupMemberActivity[] = [];

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService) { }

  ngOnInit() {
    this.groupUid = this.route.parent.parent.snapshot.params["id"];
    this.memberUid = this.route.snapshot.params["memberUid"];

    this.groupService.fetchGroupMemberByMemberUid(this.groupUid, this.memberUid)
      .subscribe(
        membership => {
          this.member = membership;
        },
        error => {
          console.log("Error loading groups", error.status)
        }
      );

    this.groupService.fetchMemberActivity(this.groupUid, this.memberUid)
      .subscribe(
        activities => {
          console.log(activities);
          this.activities = activities;
        }
      )
  }

}
