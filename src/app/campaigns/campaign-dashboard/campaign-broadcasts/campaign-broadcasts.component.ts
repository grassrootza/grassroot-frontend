import { Component, OnInit } from '@angular/core';
import { CampaignInfo } from '../../model/campaign-info';
import { BroadcastService } from '../../../broadcasts/broadcast.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Broadcast } from '../../../broadcasts/model/broadcast';

@Component({
  selector: 'app-campaign-broadcasts',
  templateUrl: './campaign-broadcasts.component.html',
  styleUrls: ['./campaign-broadcasts.component.css']
})
export class CampaignBroadcastsComponent implements OnInit {

  public campaignUid: string;
  
  public broadcasts: Broadcast[];
  public serverFetched: boolean = false;

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

}
