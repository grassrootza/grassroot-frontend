import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../../task/task.service";
import {TaskType} from "../../../task/task-type";
import {ActivatedRoute, Params} from "@angular/router";
import {Task} from "../../../task/task.model";
import {Chart} from 'chart.js';
import {GroupService} from "../../group.service";
import * as moment from 'moment';
import {UserProvince} from "../../../user/model/user-province.enum";
import {GroupJoinMethod} from "../../model/join-method";
import {ItemPercentage} from "./member-detail-percent.model";
import {Group} from "../../model/group.model";

declare var $: any;

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.css']
})
export class GroupDashboardComponent implements OnInit {

  private groupUid: string = null;

  public group: Group = null;
<<<<<<< HEAD
  public meetings: Task[] = [];
  public votes: Task[];
  public todos: Task[] = [];
=======
  public meetings: Task[];
  public votes: Task[];
  public todos: Task[];
>>>>>>> master

  public meetingToView: Task;
  public voteToView: Task;
  public todoToView: Task;

  public memberGrowthPeriods = ["THIS_MONTH", "LAST_MONTH", "THIS_YEAR", "ALL_TIME"];
  public currentMemberGrowthPeriod = "THIS_MONTH";

  public memberDetailsStats: ItemPercentage[] = [];
  public topicInterestsStats: ItemPercentage[] = [];

  public createTaskGroupUid: string = null;

  constructor(private groupService: GroupService,
              private taskService: TaskService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.route.parent.params.subscribe((params: Params) => {
      // console.log("Activated route params: ", params);
      this.groupUid = params['id'];

      // console.log("fetching group in dashboard");
      this.groupService.loadGroupDetailsCached(this.groupUid, true)
        .subscribe(
          groupDetails => {
            this.group = groupDetails;
          },
          error => {
            console.log("Error loading groups", error.status)
          }
        );

      console.log("Tasks Group id: ", this.groupUid);
      this.loadTasks();
      this.loadMemberGrowthStats(moment().year(), moment().month() + 1);
      this.loadProvinceStats();
      this.loadSourcesStats();
      this.loadOrganisationsStats();
      this.loadMemberDetailsStats();
      this.loadTopicInterestsStats();
    });
  }

  private loadTasks() {
    this.taskService
      .loadUpcomingGroupTasks(this.groupUid)
      .subscribe(
        result => {
          // console.log("Tasks loaded: ", result);
          this.meetings = result.filter(task => task.type == TaskType.MEETING);
          this.votes = result.filter(task => task.type == TaskType.VOTE);
          this.todos = result.filter(task => task.type == TaskType.TODO);
        },
        error => {
          console.log("Failed to fetch upcoming tasks for group", error);
        }
      )
  }


  showCreateMeetingModal() {
    // console.log("Show create meeting modal for group: " + this.group.groupUid);
    this.createTaskGroupUid = this.group.groupUid;
    $("#create-meeting-modal").modal("show");
  }

  meetingSaved(saveResponse) {
    console.log(saveResponse);
    $("#create-meeting-modal").modal("hide");
    this.loadTasks();
  }

  showCreateVoteModal() {
    this.createTaskGroupUid = this.group.groupUid;
    $("#create-vote-modal").modal("show");
  }

  voteSaved(saveResponse) {
    console.log(saveResponse);
    $("#create-vote-modal").modal("hide");
    this.loadTasks();
  }

  showCreateTodoModal() {
    this.createTaskGroupUid = this.group.groupUid;
    $("#create-todo-modal").modal("show");
  }

  todoSaved(saveResponse) {
    console.log(saveResponse);
    $("#create-todo-modal").modal("hide");
    this.loadTasks();
  }

  showViewMeeting(meeting: Task) {
    this.meetingToView = meeting;
    $("#view-meeting-modal").modal("show");
  }

  showViewVote(vote: Task) {
    this.voteToView = vote;
    $("#view-vote-modal").modal("show");
  }

  showViewTodo(todo: Task) {
    this.todoToView = todo;
    $("#view-todo-modal").modal("show");
  }

  public memberGrowthPeriodChanged(newPeriod: string) {
    // console.log("member growth period changed: ", newPeriod);
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
          // console.log("member growth stats for year " + year + ", month: " + month + ": ", results);

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

  chartColors = ["#c45850", "#3e95cd", "#3cba9f", "#8e5ea2", "#e8c3b9"];

  public loadProvinceStats() {
    if (!this.groupUid)
      return;

    this.groupService.fetchProvinceStats(this.groupUid)
      .subscribe(
        results => {

          // console.log("member provinces stats: ", results);

          let provinces = Object.keys(results);
          let provinceNames = [];
          let counts: number[] = [];
          let colors: string[] = [];
          let i = 0;
          provinces.forEach(
            tu => {
              counts.push(results[tu]);
              colors.push(this.chartColors[i % this.chartColors.length]);
              let pName = UserProvince[tu];
              pName = pName ? pName : "Other";
              provinceNames.push(pName);
              i++;
            }
          );

          const chart = new Chart('provincesChart', {
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
        }
      );


  }

  public loadSourcesStats() {
    if (!this.groupUid)
      return;

    this.groupService.fetchSourcesStats(this.groupUid)
      .subscribe(
        results => {

          // console.log("member sources stats: ", results);

          let sources = Object.keys(results);
          let sourceNames = [];
          let counts: number[] = [];
          let colors: string[] = [];
          let i = 0;
          sources.forEach(
            so => {
              counts.push(results[so]);
              colors.push(this.chartColors[i % this.chartColors.length]);
              let sName = GroupJoinMethod[so];
              sName = sName ? sName : "Other";
              sourceNames.push(sName);
              i++;
            }
          );

          const chart = new Chart('sourcesChart', {
            type: 'doughnut',

            data: {
              labels: sourceNames,
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
      );
  }


  public loadOrganisationsStats() {
    if (!this.groupUid)
      return;

    this.groupService.fetchOrganisationsStats(this.groupUid)
      .subscribe(
        results => {

          // console.log("member organisations stats: ", results);

          let organisations = Object.keys(results);
          let counts: number[] = [];
          let colors: string[] = [];
          let i = 0;
          organisations.forEach(
            so => {
              counts.push(results[so]);
              colors.push(this.chartColors[i % this.chartColors.length]);
              i++;
            }
          );

          const chart = new Chart('organisationsChart', {
            type: 'doughnut',

            data: {
              labels: organisations,
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
      );
  }


  public loadMemberDetailsStats() {
    if (!this.groupUid)
      return;

    this.groupService.fetchMemberDetailsStats(this.groupUid)
      .subscribe(
        results => {
          // console.log("member details stats: ", results);
          let newStats: ItemPercentage[] = [];
          let details = Object.keys(results);
          details.forEach(detail => {
              newStats.push(new ItemPercentage(detail, results[detail]));
            }
          );

          this.memberDetailsStats = newStats;
          console.log("New  member detail stats", this.memberDetailsStats);
        }
      );
  }

  public loadTopicInterestsStats() {
    if (!this.groupUid)
      return;

    this.groupService.fetchTopicInterestsStats(this.groupUid)
      .subscribe(
        results => {
          // console.log("topic interests stats: ", results);
          let newStats: ItemPercentage[] = [];
          let details = Object.keys(results);
          details.forEach(detail => {
            newStats.push(new ItemPercentage(detail, results[detail]));
            }
          );

          this.topicInterestsStats = newStats;
          console.log("New topic interests stats", this.topicInterestsStats);
        }
      );
  }


}
