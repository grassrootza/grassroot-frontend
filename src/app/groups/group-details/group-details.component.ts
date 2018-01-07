import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {GroupService} from "../group.service";
import {Group} from "../model/group.model";
import {environment} from "../../../environments/environment";
import {UserService} from "../../user/user.service";

declare var $: any;

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  public group: Group = null;
  public currentTab: string = "dashboard";
  public baseUrl: string = environment.backendAppUrl;

  public joinMethodParams: any;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService) {

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        if (this.group != null) {

          let uri = ev.urlAfterRedirects;
          let startIndex = uri.indexOf(this.group.groupUid) + this.group.groupUid.length + 1;
          this.currentTab = uri.substring(startIndex);
          if (this.currentTab.indexOf("/") >= 0)
            this.currentTab = this.currentTab.substring(0, this.currentTab.indexOf("/"));
        }
      }
    });
  }

  ngOnInit() {

    this.route.params.subscribe((params: Params) => {
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

  joinMethodsModal() {
    this.joinMethodParams = {
      completeJoinCode: environment.ussdPrefix + this.group.joinCode + '#',
      joinWords: this.group.joinWords.join(', '),
      shortCode: environment.groupShortCode
    };
    console.log("join method params = ", this.joinMethodParams);
    $('#group-join-methods').modal('show');
  }

}
