import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import {Chart} from 'chart.js';
import * as moment from 'moment-mini-ts';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  public DEFAULT_GRAPH = 'ALL_USERS';

  // note: this is reverse order, i.e., last items are top of screen, so that ones not in here go to bottom
  
  public TOP_LEVEL = [ 'ALL_USERS', 'TASKS_ALL', 'GROUPS_ALL', 'ALERTS_ALL', 'NOTIFICATIONS_ALL'];

  public LEVEL_TREE = {
    'ALL_USERS': ['ALL_USERS', 'USSD_USERS', 'USERS_NON_ENGLISH'],
    'TASKS_ALL': ['TASKS_ALL', 'MEETINGS', 'TODO', 'VOTES'],
    'GROUPS_ALL': ['GROUPS_ALL', 'GROUPS_TOKEN'],
    'ALERTS_ALL': ['LIVE_WIRE_CREATED', 'LIVE_WIRE_RELEASED', 'LIVE_WIRE_USERS', 'SAFETY_ALERTS'],
    'NOTIFICATIONS_ALL': ['NOTIFICATIONS_ALL', 'NOTIFICATIONS_DELIVERED', 'NOTIFICATIONS_FAILED']
  }

  public SEQUENCE = ['USERS_NON_ENGLISH', 'VOTES', 'TODO', 'MEETINGS',  'NOTIFICATIONS_ALL', 'ALL_USERS'];
  private SUB_ITEMS = ['USSD_USERS'];

  public metrics: string[];
  public metricTotals: any;

  public currentMetricData: any;

  lineChart: any;

  constructor(private analyticsService: AnalyticsService, private translateService: TranslateService) { }

  ngOnInit() {
    this.analyticsService.loadAnalyticsKeys().subscribe(results => {
      console.log('results: ', results);
      this.metricTotals = results;
      this.metrics = Object.keys(results)
        .filter(metric => this.SUB_ITEMS.indexOf(metric) == -1)
        .sort((a, b) => this.SEQUENCE.indexOf(b) - this.SEQUENCE.indexOf(a));
      console.log('metric keys: ', this.metrics);
      this.loadCumulativeCounts(this.DEFAULT_GRAPH);
    })
  }

  loadCumulativeCounts(metric: string) {
    this.analyticsService.loadCumulativeCountsForMetric(metric).subscribe(data => {
      console.log('data: ', data);
      this.currentMetricData = data;

      let timeStamps = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
      let values = timeStamps.map(ts => data[ts]);
      let timeLabels = timeStamps.map(ts =>  moment(parseInt(ts)).format('DD-MM-YY hh:00'));
      console.log('values: ', values);

      if (!this.lineChart)
        this.createLineChartWithData(timeLabels, values, metric);
      else
        this.setLineChartData(timeLabels, values, metric);
    });
  }

  createLineChartWithData(timeLabels, values, title?) {
      this.lineChart = new Chart('metricCountChart', {
        type: 'line',
        data: {
          labels: timeLabels,
          datasets: [{
            data: values,
            borderColor: "#2CBC4C",
            fill: true,
            backgroundColor: '#E9F8ED'
          }]
        },
        options: {
          title: {
            display: true,
            text: title ? this.translateService.instant('metric.' + title) : 'Time series'
          },
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
  }

  setLineChartData(timeLabels, values, metric) {
    let data = this.lineChart.config.data;
    data.datasets[0].data = values;
    data.labels = timeLabels;
    let options = this.lineChart.options;
    options.title.text = this.translateService.instant('metric.' + metric);
    this.lineChart.update();
  }

}
