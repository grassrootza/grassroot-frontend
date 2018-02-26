import {Component, OnInit} from '@angular/core';
import {CampaignService} from "../../campaign.service";
import {ActivatedRoute, Params} from "@angular/router";
import * as moment from 'moment';
import {Chart} from 'chart.js';

const CHART_COLORS = ["#c45850", "#3e95cd", "#3cba9f", "#8e5ea2", "#e8c3b9"];

@Component({
  selector: 'app-campaign-stats',
  templateUrl: './campaign-stats.component.html',
  styleUrls: ['./campaign-stats.component.css']
})
export class CampaignStatsComponent implements OnInit {

  private campaignUid: string = null;

  public selectedChannel: string = null;

  public activityDataDivision = "by_channel";
  public activityTimePeriod = "this_week";

  public timeUnitOptions = ['this_week', 'this_month', 'last_week', 'last_month', 'all_time'];

  activityChart: any;

  constructor(private campaignService: CampaignService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
        this.campaignUid = params['id'];
        this.loadMemberJoinStats(moment().year(), moment().month() + 1);
        this.loadConversionRates();
        this.loadChannelEngagement();
        this.loadActivityStats();
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

  public loadConversionRates() {

    this.campaignService.fetchConversionStats(this.campaignUid).subscribe(results => {
      console.log("conversion rates: ", results);

      let funnelStages = Object.keys(results);
      let stageNames = [];
      let counts: number[] = [];
      let colors: string[] = [];

      let i = 0;
      funnelStages.forEach(fs => {
          counts.push(results[fs]);
          colors.push(CHART_COLORS[i % CHART_COLORS.length]);
          // let pName = UserProvince[tu];
          // pName = pName ? pName : "Other";
          stageNames.push(fs);
          i++;
        }
      );


      const chart = new Chart('conversionRatesChart', {
        type: 'doughnut',

        data: {
          labels: stageNames,
          datasets: [
            {
              data: counts,
              backgroundColor: colors,
            }
          ]
        },
        options: {
          legend: {
            position: 'bottom',
            display: true
          }
        }
      });
    })
  }

  public loadChannelEngagement() {
    this.campaignService.fetchChannelStats(this.campaignUid).subscribe(results => {
      console.log("engagement channels: ", results);
      let channels = Object.keys(results);
      let channelNames = [];
      let counts: number[] = [];
      let colors: string[] = [];

      let i = 0;
      channels.forEach(channel => {
          counts.push(results[channel]);
          colors.push(CHART_COLORS[i % CHART_COLORS.length]);
          // let pName = UserProvince[tu];
          // pName = pName ? pName : "Other";
          channelNames.push(channel);
          i++;
        }
      );

      const chart = new Chart('engagementPieChart', {
        type: 'doughnut',

        data: {
          labels: channelNames,
          datasets: [
            {
              data: counts,
              backgroundColor: colors,
            }
          ]
        },
        options: {
          legend: {
            position: 'bottom',
            display: true
          }
        }
      });
    })
  }

  public loadProvinceEngagement() {
    this.campaignService.fetchProvinceStats(this.campaignUid).subscribe(results => {
      console.log("province stats: ", results);
      let provinces = Object.keys(results);
      let provinceNames = [];
      let counts: number[] = [];
      let colors: string[] = [];

      let i = 0;
      provinces.forEach(province => {
          counts.push(results[province]);
          colors.push(CHART_COLORS[i % CHART_COLORS.length]);
          // let pName = UserProvince[tu];
          // pName = pName ? pName : "Other";
          provinceNames.push(province);
          i++;
        }
      );

      const chart = new Chart('engagementPieChart', {
        type: 'doughnut',

        data: {
          labels: provinceNames,
          datasets: [
            {
              data: counts,
              backgroundColor: colors,
            }
          ]
        },
        options: {
          legend: {
            position: 'bottom',
            display: true
          }
        }
      });
    })
  }

  public loadActivityStats() {
    this.campaignService.fetchActivityStats(this.campaignUid, this.activityDataDivision, this.activityTimePeriod).subscribe(result => {
      console.log("result: ", result);

      let timeUnits = result['TIME_UNITS'];
      let i = 0;
      let dataSets = [];

      Object.keys(result).filter(dataType => dataType != 'TIME_UNITS').forEach(dataType => {
        let dataset = {
          label: dataType,
          backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
          data: timeUnits.map(tu => result[dataType][tu])
        };
        dataSets.push(dataset);
        i++;
      });

      console.log("data sets from result: ", dataSets);

      let barChartData = {
        labels: timeUnits,
        datasets: dataSets
      };

      this.activityChart = new Chart('activityStackedChart', {
        type: 'bar',
        data: barChartData,
        options: {
          responsive: true,
          scales: {
            xAxes: [{stacked: true}],
            yAxes: [{stacked: true}]
          }
        }
      });

    });

  }

}
