import {Component, OnInit} from '@angular/core';
import {CampaignService} from "../../campaign.service";
import {ActivatedRoute, Params} from "@angular/router";
import * as moment from 'moment';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-campaign-stats',
  templateUrl: './campaign-stats.component.html',
  styleUrls: ['./campaign-stats.component.css']
})
export class CampaignStatsComponent implements OnInit {

  private campaignUid: string = null;

  constructor(private campaignService: CampaignService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
        this.campaignUid = params['id'];
        this.loadMemberJoinStats(moment().year(), moment().month() + 1);
    });

  }

  public loadMemberJoinStats(year: number, month: number) {
    if (!this.campaignUid)
      return;

    this.campaignService.fetchMemberGrowthStats(this.campaignUid, year, month).subscribe(results => {
      console.log("member growth stats for year " + year + ", month: " + month + ": ", results);
      let timeUnits = Object.keys(results);
      let values: number[] = [];
      timeUnits.forEach(
        tu => values.push(results[tu])
      );

      const chart = new Chart('memberGrowthChart', {
        type: 'line',

        data: {
          labels: timeUnits,
          datasets: [
            {
              data: values,
              borderColor: "#2CBC4C",
              fill: true,
              backgroundColor: '#E9F8ED'
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }],
          }
        }
      });
    });
  }

}
