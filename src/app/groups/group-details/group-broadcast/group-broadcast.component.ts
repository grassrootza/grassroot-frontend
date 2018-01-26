import {Component, OnInit} from '@angular/core';
import {BroadcastService} from '../../../broadcasts/broadcast.service';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {UserService} from '../../../user/user.service';
import {GroupService} from '../../group.service';
import {Group} from '../../model/group.model';
import {environment} from '../../../../environments/environment';
import {Broadcast, BroadcastPage} from '../../../broadcasts/model/broadcast';

declare var $: any;

@Component({
  selector: 'app-group-broadcast',
  templateUrl: './group-broadcast.component.html',
  styleUrls: ['./group-broadcast.component.css']
})
export class GroupBroadcastComponent implements OnInit {

  public currentTab: string = "all";
  public group: Group = null;
  public groupUid:string = "";
  public baseUrl: string = environment.backendAppUrl;
  public currentSentPage: BroadcastPage = new BroadcastPage(0,0,0,0, true, false, []);
  public currentScheduledPage: BroadcastPage = new BroadcastPage(0,0,0,0, true, false, []);
  public modalBroadcast: Broadcast = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService,
              private broadcastService: BroadcastService) {

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.currentTab = ev.urlAfterRedirects.substring(ev.urlAfterRedirects.lastIndexOf("/") + 1);
      }
    });
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.groupUid = params['id'];
      this.goToSentPage(0);
      this.goToScheduledPage(0);

      this.groupService.loadGroupDetails(this.groupUid)
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

  goToSentPage(page: number){
    this.broadcastService.getGroupBroadcasts(this.groupUid, "IMMEDIATE", page,5).subscribe(
      resp => {
        console.log(resp);
        this.currentSentPage = resp;
      }
    );
  }

  goToScheduledPage(page: number){
    this.broadcastService.getGroupBroadcasts(this.groupUid, "FUTURE", page,2).subscribe(
      resp => {
        console.log(resp);
        this.currentScheduledPage = resp;
      }
    );
  }

  showViewModal(broadcast: Broadcast){
    this.modalBroadcast = broadcast;
    console.log(broadcast);
    $('#broadcast-view-modal').modal('show');
  }

}
