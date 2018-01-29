import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {UserService} from '../../../../user/user.service';
import {GroupService} from '../../../group.service';
import {Group} from '../../../model/group.model';

@Component({
  selector: 'app-group-members-import',
  templateUrl: './group-members-import.component.html',
  styleUrls: ['./group-members-import.component.css']
})
export class GroupMembersImportComponent implements OnInit {

  public group: Group = null;
  public currentTab: string = "file";


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
            console.log("Error loading groups", error.status)
          }
        );
    });
  }

}
