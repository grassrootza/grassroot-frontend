import {Component, OnInit} from '@angular/core';
import {BroadcastService} from '../../../broadcasts/broadcast.service';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {UserService} from '../../../user/user.service';
import {GroupService} from '../../group.service';
import {Group} from '../../model/group.model';
import {Broadcast, BroadcastPage} from '../../../broadcasts/model/broadcast';
import { saveAs } from 'file-saver';
import { AlertService } from '../../../utils/alert-service/alert.service';
import { FormGroup, FormBuilder } from '@angular/forms';


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
  public currentSentPage: BroadcastPage = new BroadcastPage(0,0,0,0, true, false, []);
  public currentScheduledPage: BroadcastPage = new BroadcastPage(0,0,0,0, true, false, []);
  public modalBroadcast: Broadcast = null;
  public resendBroadcast: Broadcast = null;
  public firstModalTab: string = "sms";

  public resendForm: FormGroup;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService,
              private broadcastService: BroadcastService,
              private alertService: AlertService,
              private fb: FormBuilder) {

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.currentTab = ev.urlAfterRedirects.substring(ev.urlAfterRedirects.lastIndexOf("/") + 1);
      }
    });

    this.resendForm = fb.group({
      'resendText': ['true'], 'resendEmail': ['true'], 'resendFb': ['true'], 'resendTwitter': ['true']
    });
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.groupUid = params['id'];
      this.goToSentPage(0);
      this.goToScheduledPage(0);

      this.groupService.loadGroupDetailsCached(this.groupUid, false)
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
        console.log(`first bc twitter: ${resp.content[0].twitterAccount}`);
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
    console.log('modal broadcast: ', this.modalBroadcast);
    this.firstModalTab = broadcast.smsContent ? 'sms' : broadcast.emailContent ? 'email' : broadcast.fbPost ? 'facebook' : 'twitter';
    $('#broadcast-view-modal').modal('show');
  }

  donwloadBroadcastErrorReport(broadcast: Broadcast) {
    this.broadcastService.downloadBroadcastErrorReport(broadcast.broadcastUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      saveAs(blob, "broadcast-error-report.xls");
    }, error => {
      console.log("error getting the file: ", error);
    });
  }

  showResendModal(broadcast: Broadcast) {
    this.resendBroadcast = broadcast;
    this.resendForm.setValue({
      'resendText': !!broadcast.smsContent, 'resendEmail': !!broadcast.emailContent, 'resendFb': !!broadcast.fbPost, 'resendTwitter': !!broadcast.twitterPost
    })
    $('#broadcast-resend-modal').modal('show');
  }

  resendModalComplete(broadcast: Broadcast) {
    console.log('resend form values: ', this.resendForm.value);
    this.broadcastService.resendBroadcast(broadcast.broadcastUid, this.resendForm.value).subscribe(resent => {
      console.log(`succeeded, response: ${resent}`);
      $('#broadcast-resend-modal').modal('hide');
      this.alertService.alert('broadcast succeeded');
      this.goToSentPage(0);
    }, error => {
      $('#broadcast-resend-modal').modal('hide');
      console.log("error resending broadcast: ", error);
    })
  }

}
