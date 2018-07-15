import { Component, OnInit } from '@angular/core';
import { BroadcastService } from '../../../broadcasts/broadcast.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Broadcast } from '../../../broadcasts/model/broadcast';
import { saveAs } from 'file-saver';

declare var $: any;

@Component({
  selector: 'app-campaign-broadcasts',
  templateUrl: './campaign-broadcasts.component.html',
  styleUrls: ['./campaign-broadcasts.component.css']
})
export class CampaignBroadcastsComponent implements OnInit {

  public campaignUid: string;
  
  public broadcasts: Broadcast[];
  public serverFetched: boolean = false;

  public modalBroadcast: Broadcast;
  public firstModalTab: string;

  constructor(private broadcastService: BroadcastService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.campaignUid = params['id'];
      this.broadcastService.getCampaignBroadcasts(this.campaignUid).subscribe(broadcasts => {
        console.log('fetched broadcasts from server: ', broadcasts);
        this.serverFetched = true;
        this.broadcasts = broadcasts;
      });
    });
  }

  downloadBroadcastErrorReport(broadcast: Broadcast) {
    this.broadcastService.downloadBroadcastErrorReport(broadcast.broadcastUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      saveAs(blob, "broadcast-error-report.xls");
    }, error => {
      console.log("error getting the file: ", error);
    });
  }

  downloadAllMsgReport(broadcast: Broadcast) {
    this.broadcastService.downloadBroadcastMsgsReport(broadcast.broadcastUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      saveAs(blob, "broadcast-error-report.xls");      
    }, error => {
      console.log('error downloading report: ', error);
    })
  }

  showViewModal(broadcast: Broadcast){
    this.modalBroadcast = broadcast;
    console.log('modal broadcast: ', this.modalBroadcast);
    // this.firstModalTab = broadcast.smsContent ? 'sms' : broadcast.emailContent ? 'email' : broadcast.fbPost ? 'facebook' : 'twitter';
    $('#broadcast-view-modal').modal('show');
  }

}
