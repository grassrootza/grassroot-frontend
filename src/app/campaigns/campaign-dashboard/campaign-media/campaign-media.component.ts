import { Component, OnInit } from '@angular/core';
import { CampaignMediaRecord } from './campaign-media-record.model';
import { CampaignService } from '../../campaign.service';
import { ActivatedRoute } from '@angular/router';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-campaign-media',
  templateUrl: './campaign-media.component.html',
  styleUrls: ['./campaign-media.component.css']
})
export class CampaignMediaComponent implements OnInit {

  campaignUid: string;
  mediaRecords: CampaignMediaRecord[] = [];

  constructor(private campaignService: CampaignService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.campaignUid = params['id'];
      this.campaignService.fetchCampaignMedia(this.campaignUid).subscribe(result => {
        console.log('Retrieved records: ', result);
        this.mediaRecords = result;
      });
    });
  }

}
