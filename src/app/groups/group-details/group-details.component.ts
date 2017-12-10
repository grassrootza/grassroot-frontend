import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {GroupInfo} from "../model/group-info.model";
import {GroupService} from "../group.service";

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  public group: GroupInfo = null;
  public currentTab: string = "dashboard";

  constructor(private router: Router,
              private route: ActivatedRoute,
              private groupService: GroupService) {

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.currentTab = ev.urlAfterRedirects.substring(ev.urlAfterRedirects.lastIndexOf("/") + 1);
      }
    });
  }

  ngOnInit() {

    this.groupService.loadGroups(false);
    this.route.params.subscribe((params: Params) => {
      let groupUid = params['id'];
      this.groupService.groupInfoList.subscribe(
        groups => {
          this.group = groups.find(gr => gr.uid == groupUid);
        }
      );
    });

  }

}
