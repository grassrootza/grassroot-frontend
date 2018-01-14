import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../../task/task.service";
import {TaskType} from "../../../task/task-type";
import {ActivatedRoute, Params} from "@angular/router";
import {Task} from "../../../task/task.model";
import {Chart} from 'chart.js';
import {GroupService} from "../../group.service";
import * as moment from 'moment';

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.css']
})
export class GroupDashboardComponent implements OnInit {

  private groupUid: string = null;
  public meetings: Task[] = [];
  public votes: Task[] = [];
  public todos: Task[] = [];
  public today = moment();

  public memberGrowthPeriods = ["THIS_MONTH", "LAST_MONTH", "THIS_YEAR", "ALL_TIME"];
  public currentMemberGrowthPeriod = "THIS_MONTH";

  constructor(private groupService: GroupService,
              private taskService: TaskService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.route.parent.params.subscribe((params: Params) => {
      console.log("Activated route params: ", params);
      this.groupUid = params['id'];
      console.log("Tasks Group id: ", this.groupUid);
      this.loadTasks();
      this.loadMemberGrowthStats(moment().year(), moment().month() + 1);
    });


  }

  private loadTasks() {
    this.taskService
      .loadUpcomingGroupTasks(this.groupUid)
      .subscribe(
        result => {
          console.log("Tasks loaded: ", result);
          this.meetings = result.filter(task => task.type == TaskType.MEETING);
          this.votes = result.filter(task => task.type == TaskType.VOTE);
          this.todos = result.filter(task => task.type == TaskType.TODO);
        },
        error => {
          console.log("Failed to fetch upcoming tasks for group", error);
        }
      )
  }

  public memberGrowthPeriodChanged(newPeriod: string) {
    console.log("member growth period changed: ", newPeriod);
    this.currentMemberGrowthPeriod = newPeriod;
    switch (newPeriod) {
      case 'THIS_MONTH':
        let now = moment();
        this.loadMemberGrowthStats(now.year(), now.month() + 1);
        break;
      case 'LAST_MONTH':
        let lastMonth = moment().add(-1, 'month');
        this.loadMemberGrowthStats(lastMonth.year(), lastMonth.month() + 1);
        break;
      case 'THIS_YEAR':
        this.loadMemberGrowthStats(moment().year(), null);
        break;
      case 'ALL_TIME':
        this.loadMemberGrowthStats(null, null);
        break;
    }

  }

  public loadMemberGrowthStats(year: number, month: number) {

    if (!this.groupUid)
      return;

    this.groupService.fetchMemberGrowthStats(this.groupUid, year, month)
      .subscribe(
        results => {
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
        }
      );
  }
}
