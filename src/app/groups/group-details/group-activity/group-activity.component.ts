import {Component, OnInit} from '@angular/core';
import { saveAs } from 'file-saver';
import {UserService} from '../../../user/user.service';
import {GroupService} from '../../group.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskService} from '../../../task/task.service';
import {Task} from '../../../task/task.model';
import {TaskType} from '../../../task/task-type';
import { AlertService } from 'app/utils/alert-service/alert.service';

declare var $: any;


@Component({
  selector: 'app-group-activity',
  templateUrl: './group-activity.component.html',
  styleUrls: ['./group-activity.component.css']
})
export class GroupActivityComponent implements OnInit {

  public groupUid: string = "";
  public upcomingTasks: Task[] = [];
  public taskTypes = TaskType;
  public pastTasks : Task[] = [];

  public finishedLoading: boolean = false;

  public createTaskGroupUid: string = null;

  public taskToView: Task;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private groupService: GroupService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.groupUid = params['id'];
      // console.log("User uid={},group uid={}",this.userService.getLoggedInUser().userUid,this.groupUid);
      this.loadAllGroupTasks();
    });
  }

  loadAllGroupTasks(){
    this.taskService.loadAllGroupTasks(this.groupUid).subscribe(tasks => {
          console.log('all tasks: ', tasks.length);
          this.upcomingTasks = tasks.filter(t => t.isActive());
          this.pastTasks = tasks.filter(t => !t.isActive());
          console.log("Old Tasks: ", this.pastTasks.length);
          this.finishedLoading = true;
        }, error =>{
        console.log('Error loading tasks: ', error.getmessage);
    });
  }

  handleTaskClicked(task: Task) {
    this.taskToView = task;
    if (task.type == 'MEETING') {
      $('#view-meeting-modal').modal('show');
    } else if (task.type == 'VOTE') {
      $('#view-vote-modal').modal('show');
    } else if (task.type == 'TODO') {
      $('#view-todo-modal').modal('show');
    }
  }

  showCreateMeetingModal(){
    this.createTaskGroupUid = this.groupUid;
    $("#create-meeting-modal").modal("show");
  }

  meetingSaved(saveResponse){
    console.log(saveResponse);
    $("#create-meeting-modal").modal("hide");
    if(saveResponse)
      this.loadAllGroupTasks();
  }

  showCreateVoteModal(){
    this.createTaskGroupUid = this.groupUid;
    $("#create-vote-modal").modal("show");
  }

  voteSaved(saveResponse){
    console.log(saveResponse);
    $("#create-vote-modal").modal("hide");
    if(saveResponse)
      this.loadAllGroupTasks();
  }

  showCreateTodoModal(){
    this.createTaskGroupUid = this.groupUid;
    $("#create-todo-modal").modal("show");
  }

  todoSaved(saveResponse){
    console.log(saveResponse);
    $("#create-todo-modal").modal("hide");
    if(saveResponse)
      this.loadAllGroupTasks();
  }

  downloadEventErrorReport(task: Task) {
    this.taskService.downloadBroadcastErrorReport(task.type, task.taskUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      saveAs(blob, "task-error-report.xls");
    }, error => {
      console.log("error getting the file: ", error);
    });
  }

  showCreateLivewireAlertModal(){
    this.createTaskGroupUid = this.groupUid;
    this.groupService.isUserBlockedFromLiveWire().subscribe(isBlocked => {
      if (!isBlocked) {
        $("#create-livewire-alert-modal").modal("show");
      } else {
        this.alertService.alert("You have been blocked!");
      }
    })
    
  }

  alertSaved(alertSavedEvent){
    $("#create-livewire-alert-modal").modal("hide");
    if(alertSavedEvent)
    this.loadAllGroupTasks();
  }
}
