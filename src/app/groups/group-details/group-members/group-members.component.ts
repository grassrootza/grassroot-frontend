import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {GroupService} from "../../group.service";
import {UserService} from "../../../user/user.service";
import {Group} from "../../model/group.model";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-group-members',
  templateUrl: './group-members.component.html',
  styleUrls: ['./group-members.component.css']
})
export class GroupMembersComponent implements OnInit {


  public currentTab: string = "all";
  public group: Group = null;
  public baseUrl: string = environment.backendAppUrl;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService) {

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.currentTab = ev.urlAfterRedirects.substring(ev.urlAfterRedirects.lastIndexOf("/") + 1);
      }
    });
  }

  ngOnInit() {

    this.route.parent.params.subscribe((params: Params) => {
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
