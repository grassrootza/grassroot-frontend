import {Component, OnInit} from '@angular/core';
import {TaskService} from "../task/task.service";
import {UserService} from "../user/user.service";
import {DatePipe} from "@angular/common";
import {GroupService} from "../groups/group.service";
import {GroupInfo} from "../groups/model/group-info.model";
import {Membership, MembersPage} from "../groups/model/membership.model";
import {DayTasks} from "./day-task.model";

import * as moment from 'moment';
import {Moment} from 'moment';
import {GroupRef} from "../groups/model/group-ref.model";
import {Router} from "@angular/router";
import {CampaignInfo} from "../campaigns/model/campaign-info";
import {Task} from "../task/task.model";
import {TaskType} from "../task/task-type";
import {TodoType} from "../task/todo-type";
import {AlertService} from "../utils/alert.service";
import {CampaignService} from "../campaigns/campaign.service";

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private myTasks: DayTasks[] = [];
  public baseDateFilteredTasks: DayTasks[] = [];
  public pinnedGroups: GroupInfo[] = [];
  public activeCampaigns: CampaignInfo[] = [];
  public newMembersPage: MembersPage = null;
  public newMembersListRendered: Membership[];

  public agendaBaseDate: Moment;

  public toDoToRespond: Task = null;

  public createTaskGroupUid: string = null;

  private tasksLoadFinished = false;
  private newMembersLoadFinished = false;
  private groupsLoadFinished = false;

  public taskToView:Task;

  public voteResponse:string;

  constructor(private taskService: TaskService,
              private userService: UserService,
              private groupService: GroupService,
              private campaignService: CampaignService,
              private router: Router,
              private alertService: AlertService) {
    this.agendaBaseDate = moment().startOf('day');
  }

  ngOnInit() {

    if (!this.tasksLoadFinished || !this.newMembersLoadFinished || !this.newMembersLoadFinished) {
      console.log("Showing spinner");
      this.alertService.showLoading();
    }

    this.taskService.upcomingTasks
      .subscribe(
        tasks => {
        if (tasks) {
          this.myTasks = this.groupTasksByDay(tasks);
          this.filterMyAgendaTasksRegardingBaseDate();
          this.tasksLoadFinished = true;
          this.hideSpinnerIfAllLoaded();
        }
        });

    this.taskService.upcomingTaskError.subscribe(
      error => {
        if (error) {
          console.log("Tasks load failed:", error);
          this.tasksLoadFinished = true;
          this.hideSpinnerIfAllLoaded();
        }
      }
    );


    this.groupService.newMembersInMyGroups.subscribe(newMembersPage => {
        if (newMembersPage) {
          this.newMembersPage = newMembersPage;
          this.newMembersListRendered = newMembersPage.content.slice(0, 20); // otherwise if a big entrance lately, mammoth render time
          this.newMembersLoadFinished = true;
          this.hideSpinnerIfAllLoaded();
        }
      });

    // this.newMembersPage = this.groupService.newMembersInMyGroups.map(membersPage => membersPage.content);


    this.groupService.newMembersInMyGroupsError
      .subscribe(
        error => {
          if (error) {
            this.newMembersLoadFinished = true;
            this.hideSpinnerIfAllLoaded();
            console.log("New members load failed!", error);
          }
        }
      );


    this.groupService.groupInfoList
      .subscribe(
        groups => {
          if (groups) {
            this.pinnedGroups = groups.filter(gr => gr.pinned);
            this.groupsLoadFinished = true;
            this.hideSpinnerIfAllLoaded();
          }
        }
      );

    this.groupService.groupInfoList
      .subscribe(
        error => {
          if (error) {
            console.log("Pinned groups load failed!", error);
            this.groupsLoadFinished = true;
            this.hideSpinnerIfAllLoaded();
          }
        }
      );

    this.campaignService.campaignInfoList.subscribe(campaignList => {
      this.activeCampaigns = campaignList.filter(cp => cp.isActive());
    });

    this.taskService.loadUpcomingUserTasks(this.userService.getLoggedInUser().userUid);
    this.groupService.fetchNewMembers(7, 0, 500);
    this.groupService.loadGroups();

  }

  // campaigns are heavy, and bottom of page, so load them last
  private hideSpinnerIfAllLoaded() {
    if (this.tasksLoadFinished && this.newMembersLoadFinished && this.groupsLoadFinished) {
      this.alertService.hideLoadingDelayed();
      this.campaignService.loadCampaigns();
    }
  }

  private groupTasksByDay(tasks) {
    let newTasks: DayTasks[] = [];
    tasks.forEach(t => {
      let taskDate = new Date(t.deadlineDate.getFullYear(), t.deadlineDate.getMonth(), t.deadlineDate.getDate());
      let dayTasks = newTasks.find(td => td.date.toDateString() == taskDate.toDateString());
      if (!dayTasks) {
        dayTasks = new DayTasks(taskDate, []);
        newTasks.push(dayTasks);
      }
      dayTasks.tasks.push(t)
    });
    return newTasks;
  }

  showCreateGroupDialog(): boolean {
    $('#create-group-modal').modal("show");
    return false;
  }

  groupCreated(groupRef: GroupRef) {
    console.log("Group successfully created, groupUid: ", groupRef.groupUid);
    this.router.navigate(["/group/" + groupRef.groupUid]);
  }

  groupCreationFailed(error: any) {
    console.log("Failed to create group. Error: ", error)
  }

  formatTaskDate(date: Date): string {
    const dayName = this.getDayName(date);
    return dayName + (dayName ? ", " : "") + new DatePipe("en").transform(date, "dd MMM yyyy");
  }

  getDayName(date: Date): string {
    let today = moment().startOf('day');
    if (moment(date).startOf('day').isSame(today))
      return "Today";
    else if (moment(date).week() == moment(today).week())
      return new DatePipe("en").transform(date, "EEEE");
    else return "";
  }

  increaseAgendaBaseDate() {
    this.agendaBaseDate.add(1, 'days');
    this.filterMyAgendaTasksRegardingBaseDate()
  }

  decreaseAgendaBaseDate() {
    let today = moment().startOf('day');
    if (moment(this.agendaBaseDate).isAfter(today)) {
      this.agendaBaseDate.add(-1, 'days');
      this.filterMyAgendaTasksRegardingBaseDate()
    }
  }

  private filterMyAgendaTasksRegardingBaseDate() {

    let maxDays = 5;
    let maxTasksPerNonBaseDay = 3;
    let maxTasksTotal = 5;

    let totalTasks = 0;

    let filteredTasks = [];

    this.myTasks.forEach(td => {

      if (filteredTasks.length < maxDays) {

        if (moment(td.date).isSame(moment(this.agendaBaseDate))) {
          //if this is base date, show all tasks
          filteredTasks.push(new DayTasks(td.date, td.tasks));
          totalTasks += td.tasks.length;
        }
        else if (moment(td.date).isAfter(this.agendaBaseDate) && totalTasks < maxTasksTotal) {
          //if this is NOT base date, show max 3 tasks
          let start = 0;
          let end = Math.min(td.tasks.length, maxTasksPerNonBaseDay);
          filteredTasks.push(new DayTasks(td.date, td.tasks.slice(start, end)));
          totalTasks += end;
        }
      }
    });

    this.baseDateFilteredTasks = filteredTasks;
  }

  handleTaskClick(task: Task): boolean {
    this.taskToView = task;
    if (
      task.type == TaskType.TODO
      && task.todoType != TodoType.ACTION_REQUIRED
      && (task.thisUserAssigned || task.wholeGroupAssigned)
      && !task.hasResponded
    ) {

      this.toDoToRespond = task;
      $('#respond-todo-modal').modal("show");
    }

    if(task.type == TaskType.VOTE){
      console.log("Is a vote.................");
      this.taskService.viewVote(this.taskToView.taskUid,this.userService.getLoggedInUser().msisdn).subscribe(resp=>{
        this.voteResponse = resp.data.reply;
        console.log("Vote response...........",this.voteResponse);
      })
    }

    switch (task.type){
      case TaskType.MEETING:
        $('#view-meeting-modal').modal("show");
        break;
      case TaskType.VOTE:
        $('#view-vote-modal').modal("show");
        break;
    }
    return false;
  }

  showGroup(group: GroupInfo) {
    console.log("home page, showing spinner, maybe");
    this.router.navigate(["/group", group.groupUid]);
  }

  showCreateMeetingModal(group: GroupInfo) {
    console.log("Show create meeting modal for group: " + group.groupUid);
    this.createTaskGroupUid = group.groupUid;
    $("#create-meeting-modal").modal("show");
  }

  meetingSaved(saveResponse) {
    console.log(saveResponse);
    this.taskService.loadUpcomingUserTasks(this.userService.getLoggedInUser().userUid);
    $("#create-meeting-modal").modal("hide");
  }

  showCreateVoteModal(group: GroupInfo) {
    this.createTaskGroupUid = group.groupUid;
    $("#create-vote-modal").modal("show");
  }

  voteSaved(saveResponse) {
    console.log(saveResponse);
    this.taskService.loadUpcomingUserTasks(this.userService.getLoggedInUser().userUid);
    $("#create-vote-modal").modal("hide");
  }

  showCreateTodoModal(group: GroupInfo) {
    this.createTaskGroupUid = group.groupUid;
    $("#create-todo-modal").modal("show");
  }

  todoSaved(saveResponse) {
    console.log(saveResponse);
    this.taskService.loadUpcomingUserTasks(this.userService.getLoggedInUser().userUid);
    $("#create-todo-modal").modal("hide");
  }

  searchGlobaly(searchTerm:string){
    console.log("Search Term............>>>>>>>>",searchTerm);
    this.router.navigate(["/search",searchTerm]);
  }
}
