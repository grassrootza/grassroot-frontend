import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import {Chart} from 'chart.js';
import * as moment from 'moment';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  public DEFAULT_GRAPH = 'ALL_USERS';

  // note: this is reverse order, i.e., last items are top of screen, so that ones not in here go to bottom
  public SEQUENCE = ['USERS_NON_ENGLISH', 'VOTES', 'TODO', 'MEETINGS',  'NOTIFICATIONS_ALL', 'ALL_USERS'];
  private SUB_ITEMS = ['USSD_USERS'];

  public metrics: string[];
  public metricTotals: any;

  public currentMetricData: any;

  lineChart: any;

  constructor(private analyticsService: AnalyticsService) { }

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
        this.createLineChartWithData(timeLabels, values);
      else
        this.setLineChartData(timeLabels, values);
    });
  }

  createLineChartWithData(timeLabels, values) {
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

  setLineChartData(timeLabels, values) {
    let data = this.lineChart.config.data;
    data.datasets[0].data = values;
    data.labels = timeLabels;
    this.lineChart.update();
  }

}
