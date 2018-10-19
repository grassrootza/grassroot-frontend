import {Component, OnInit} from '@angular/core';
import {TaskService} from "../task/task.service";
import {UserService} from "../user/user.service";
import {DatePipe} from "@angular/common";
import {GroupService} from "../groups/group.service";
import {GroupInfo} from "../groups/model/group-info.model";
import {Membership, MembersPage} from "../groups/model/membership.model";
import {DayTasks} from "./day-task.model";

import * as moment from 'moment-mini-ts';
import {Moment} from 'moment-mini-ts';
import {GroupMembersRef, GroupRef} from "../groups/model/group-ref.model";
import {Router} from "@angular/router";
import {CampaignInfo} from "../campaigns/model/campaign-info";
import {Task} from "../task/task.model";
import {TaskType} from "../task/task-type";
import {AlertService} from "../utils/alert-service/alert.service";
import {CampaignService} from "../campaigns/campaign.service";
import {SearchService} from "../search/search.service";

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
  public newMembersCount: number = 0;
  public newMembersListRendered: Membership[];

  public agendaBaseDate: Moment;

  public createTaskGroupUid: string = null;

  private tasksLoadFinished = false;
  private newMembersLoadFinished = false;
  private groupsLoadFinished = false;
  private campaignLoadFinished = false;

  public taskToView:Task;

  public joinCandidateGroup:GroupRef;
  public isMemberPartOfGroup:boolean = false;
  public groupMembersRef:GroupMembersRef;
  public proposedSearchTerm: string = "";

  public canManageCampaigns: boolean;

  constructor(private taskService: TaskService,
              private userService: UserService,
              private groupService: GroupService,
              private campaignService: CampaignService,
              private router: Router,
              private alertService: AlertService,
              private searchService:SearchService) {
    this.agendaBaseDate = moment().startOf('day');
    // console.log("found the cookie? ", this.cookieService.get("testing"));
  }

  ngOnInit() {

    this.canManageCampaigns = this.userService.hasActivePaidAccount();

    if (!this.tasksLoadFinished || !this.newMembersLoadFinished || !this.newMembersLoadFinished) {
      // this.alertService.showLoading();
    }

    this.taskService.upcomingTasks.subscribe(tasks => {
        if (tasks) {
          this.myTasks = this.groupTasksByDay(tasks);
          this.filterMyAgendaTasksRegardingBaseDate();
          this.tasksLoadFinished = true;
          this.hideSpinnerIfAllLoaded();
        }
    });

    this.taskService.upcomingTaskError.subscribe(error => {
        if (error) {
          this.tasksLoadFinished = true;
          this.hideSpinnerIfAllLoaded();
        }
      }
    );


    this.groupService.newMembersInMyGroups.subscribe(newMembersPage => {
        this.hideSpinnerIfAllLoaded();
        console.log('new members page: ', newMembersPage);
        if (newMembersPage) {
          this.newMembersCount = newMembersPage.totalElements;
          this.newMembersListRendered = !newMembersPage ? [] : newMembersPage.content.slice(0, 20); // otherwise if a big entrance lately, mammoth render time
          console.log('members list rendered: ', this.newMembersListRendered);
          this.newMembersLoadFinished = true;
          this.hideSpinnerIfAllLoaded();
        }
      });

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

    this.groupService.groupInfoList.subscribe(groups => {
      if (groups) {
        this.pinnedGroups = groups.filter(gr => gr.pinned);
        this.groupsLoadFinished = true;
        this.hideSpinnerIfAllLoaded();
      }
    }, error => {
      console.log("Pinned groups load failed!", error);
      this.groupsLoadFinished = true;
      this.hideSpinnerIfAllLoaded();
    });

    if (this.canManageCampaigns) {
      this.campaignService.campaignInfoList.subscribe(campaignList => {
        this.activeCampaigns = campaignList.filter(cp => cp.isActive());
        this.campaignLoadFinished = true; // but this is triggered early, so, to revise later
      });
      this.campaignService.loadCampaigns();
    }

    this.taskService.loadUpcomingUserTasks();
    this.groupService.fetchNewMembers(7, 0, 500);
    this.groupService.loadGroups();

  }

  // campaigns are heavy, and bottom of page, so load them last
  private hideSpinnerIfAllLoaded() {
    if (this.tasksLoadFinished && this.newMembersLoadFinished && this.groupsLoadFinished) {
      this.alertService.hideLoadingDelayed();
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
    switch (task.type){
      case TaskType.MEETING:
        $('#view-meeting-modal').modal("show");
        break;
      case TaskType.VOTE:
        $('#view-vote-modal').modal("show");
        break;
      case TaskType.TODO:
        $('#view-todo-modal').modal("show");
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
    this.taskService.loadUpcomingUserTasks();
    $("#create-meeting-modal").modal("hide");
  }

  showCreateVoteModal(group: GroupInfo) {
    this.createTaskGroupUid = group.groupUid;
    $("#create-vote-modal").modal("show");
  }

  voteSaved(saveResponse) {
    console.log(saveResponse);
    this.taskService.loadUpcomingUserTasks();
    $("#create-vote-modal").modal("hide");
  }

  showCreateTodoModal(group: GroupInfo) {
    this.createTaskGroupUid = group.groupUid;
    $("#create-todo-modal").modal("show");
  }

  todoSaved(saveResponse) {
    console.log(saveResponse);
    this.taskService.loadUpcomingUserTasks();
    $("#create-todo-modal").modal("hide");
  }

  showCreateLivewireAlertModal(group: GroupInfo){
    this.createTaskGroupUid = group.groupUid;
    $("#create-livewire-alert-modal").modal("show");
  }

  alertSaved(saveResponse){
    $("#create-livewire-alert-modal").modal("hide");
  }

  searchGlobaly(searchTerm:string){
    if(this.searchService.isSearchTermJoinCode(searchTerm) != null){
      this.loadGroupWithJoinCode(searchTerm);
    }else{
      // console.log("Searching globally ..................");
      this.router.navigate(["/search",searchTerm]);
    }
  }

  loadGroupWithJoinCode(joinCode:string){
    this.searchService.findGroupWithJoinCode(this.searchService.isSearchTermJoinCode(joinCode)).subscribe(resp =>{
        // console.log("Group found............",resp);
        if(resp === null){
          this.proposedSearchTerm = joinCode;
          $("#join-code-not-found-modal").modal("show");
        } else {
          this.joinCandidateGroup = resp;
          this.memberPartOfGroup(this.joinCandidateGroup.groupUid,this.userService.getLoggedInUser().userUid);
          $("#join-group-modal").modal("show");
        }
      },error => {
        console.log("Error trying to find group...........",error);
      });
  }

  joinGroup(groupUid:string, joinCode:string){
     this.searchService.joinWithCode(groupUid,joinCode).subscribe(resp => {
      //  console.log("Response from server..............",resp);
       $("#join-group-modal").modal("hide");
       this.router.navigate(["/group",groupUid]);//Viewing group joined.
     },error => {
      //  console.log("Error joining group.........................",error);
     });
  }

  memberPartOfGroup(groupUid:string,memberUid:string){
    this.groupService.loadGroupDetailsFromServer(groupUid).subscribe(group =>{
      this.groupMembersRef = new GroupMembersRef(group.groupUid,group.name,group.memberCount,group.members);
      if(this.groupMembersRef.hasMember(memberUid)){
        this.isMemberPartOfGroup = true;
      }
    },error =>{
      console.log("Error loading group..........",error);
    });
  }

  viewGroup(groupUid:string){
    $("#join-group-modal").modal("hide");
    this.router.navigate(["/group",groupUid]);
    return false;
  }
}
