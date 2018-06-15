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

  public metrics: string[];
  public metricTotals: any;

  public currentMetricData: any;

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit() {
    this.analyticsService.loadAnalyticsKeys().subscribe(results => {
      console.log('results: ', results);
      this.metricTotals = results;
      this.metrics = Object.keys(results);
      console.log('metric keys: ', this.metrics);
      this.loadCumulativeCounts(this.DEFAULT_GRAPH);
    })
  }

  loadCumulativeCounts(metric: string) {
    this.analyticsService.loadCumulativeCountsForMetric(metric).subscribe(data => {
      console.log('data: ', data);
      this.currentMetricData = data;

      let timeStamps = Object.keys(data);
      let values = timeStamps.map(ts => data[ts]);
      let timeLabels = timeStamps.map(ts =>  moment(parseInt(ts)).format('DD-MM-YY hh:00'));
      console.log('values: ', values);

      const chart = new Chart('metricCountChart', {
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

}
