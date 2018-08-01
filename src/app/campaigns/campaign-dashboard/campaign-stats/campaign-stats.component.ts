import {Component, OnInit} from '@angular/core';
import {CampaignService} from "../../campaign.service";
import {ActivatedRoute, Params} from "@angular/router";
import * as moment from 'moment-mini-ts';
import {Chart} from 'chart.js';
import {CampaignInfo} from "../../model/campaign-info";
import { TranslateService } from '@ngx-translate/core';

const CHART_COLORS = ["#c45850", "#3e95cd", "#3cba9f", "#8e5ea2", "#e8c3b9"];

@Component({
  selector: 'app-campaign-stats',
  templateUrl: './campaign-stats.component.html',
  styleUrls: ['./campaign-stats.component.css']
})
export class CampaignStatsComponent implements OnInit {

  private campaignUid: string = null;
  public campaign: CampaignInfo;

  public selectedChannel: string = null;
  public totalEngaged: number;
  public totalJoined: number;

  public activityDataDivision = "by_channel";
  public activityTimePeriod = "this_week";

  public timeUnitOptions = ['this_week', 'this_month', 'last_week', 'last_month', 'all_time'];

  activityChart: any;
  channelProvinceChart: any;

  constructor(private campaignService: CampaignService,
              private route: ActivatedRoute, private translateService: TranslateService) { }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
        this.campaignUid = params['id'];
        this.campaignService.loadCampaign(this.campaignUid).subscribe(campaign => this.campaign = campaign);
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
      this.totalJoined = values[values.length - 1];
      console.log('correct total joined: ', this.totalJoined);
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
              display: true,
              ticks: {
                beginAtZero: true
              }
            }],
          }
        }
      });
    });
  }

  public loadConversionRates() {

    this.campaignService.fetchConversionStats(this.campaignUid).subscribe(results => {
      // console.log("conversion rates: ", results);

      let funnelStages = Object.keys(results);
      let stageNames = [];
      let counts: number[] = [];
      let colors: string[] = [];

      let i = 0;
      funnelStages.forEach(fs => {
          counts.push(results[fs]);
          colors.push(CHART_COLORS[i % CHART_COLORS.length]);
          this.translateService.get(`enum.CampaignLog.${fs}`).subscribe(label => stageNames.push(label));
          i++;
        }
      );

      this.totalEngaged = counts.reduce((accumulator, currentValue) => accumulator + currentValue)
      console.log("TOTAL ENGAGED: ", this.totalEngaged);

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
      // console.log("engagement channels: ", results);
      let channels = Object.keys(results);
      let channelNames = [];
      let counts: number[] = [];
      let colors: string[] = [];

      let i = 0;
      channels.forEach(channel => {
          counts.push(results[channel]);
          colors.push(CHART_COLORS[i % CHART_COLORS.length]);
          this.translateService.get(`enum.UserInterface.${channel}`).subscribe(value => channelNames.push(value));;
          i++;
        }
      );

      if (!this.channelProvinceChart) {
        this.createChannelProvinceChart(counts, colors, channelNames);
      } else {
        this.setChannelProvinceData(counts, colors, channelNames);
      }
    })
  }

  public provinceStats = [];
  public channelStats = [];

  public loadProvinceEngagement() {
    console.log('Loading provincial stats');
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
          this.translateService.get(`enum.UserProvince.${province}`).subscribe(provinceName => provinceNames.push(provinceName));
          i++;
        }
      );

      if (!this.channelProvinceChart) {
        this.createChannelProvinceChart(counts, colors, provinceNames);
      } else {
        console.log('Channel chart exists, resetting data');
        this.setChannelProvinceData(counts, colors, provinceNames);
      }
    })
  }

  private createChannelProvinceChart(counts, colors, labels) {
    this.channelProvinceChart = new Chart('engagementPieChart', {
      type: 'doughnut',

      data: {
        labels: labels,
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
  }

  private setChannelProvinceData(counts, colors, labels) {
    console.log('updating channel / province data ...');
    let data = this.channelProvinceChart.config.data;
    data.datasets[0].data = counts;
    data.datasets[0].backgroundColor = colors;
    data.labels = labels;
    this.channelProvinceChart.update();
  }

  public loadActivityStats() {
    this.campaignService.fetchActivityStats(this.campaignUid, this.activityDataDivision, this.activityTimePeriod).subscribe(result => {
      // console.log("result: ", result);

      let timeUnits = result['TIME_UNITS'];
      let i = 0;
      let dataSets = [];

      const i18KeyPrefix = 'enum.' + (this.activityDataDivision === 'by_channel' ? 'UserInterface' : 'UserProvince') + '.';

      Object.keys(result).filter(dataType => dataType != 'TIME_UNITS').forEach(dataType => {
        let dataset = {
          label: this.translateService.instant(i18KeyPrefix + dataType),
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
