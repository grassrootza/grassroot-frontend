import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../user/user.service';
import {GroupService} from '../../group.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskService} from '../../../task/task.service';
import {Task} from '../../../task/task.model';
import {TaskType} from '../../../task/task-type';

declare var $: any;


@Component({
  selector: 'app-group-activity',
  templateUrl: './group-activity.component.html',
  styleUrls: ['./group-activity.component.css']
})
export class GroupActivityComponent implements OnInit {

  public groupUid: string = "";
  public userUid: string = "";
  public upcomingTasks: Task[] = [];
  public taskTypes = TaskType;
  public pastTasks : Task[] = [];

  public createTaskGroupUid: string = null;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService,
              private taskService: TaskService) {


  }


  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.groupUid = params['id'];
      console.log("User uid={},group uid={}",this.userService.getLoggedInUser().userUid,this.groupUid);
      this.loadTasks();
      this.loadAllGroupTasks();
    });
    this.userUid = this.userService.getLoggedInUser().userUid;
    this.loadAllGroupTasks();
  }

  loadTasks(){
    this.taskService.loadUpcomingGroupTasks(this.groupUid)
      .subscribe(
        tasks => {
          console.log(tasks);
          this.upcomingTasks = tasks;
        },
        error => {
          if(error.status = 401)
            this.userService.logout();
          console.log("Error loading tasks for group", error.status);
        }
      );
  }

  loadAllGroupTasks(){
    console.log("calling subscribe");

    this.taskService.loadAllGroupTasks(this.userService.getLoggedInUser().userUid, this.groupUid)
      .subscribe(tasks => {
          let now = new Date();
          this.pastTasks = tasks.filter(t => new Date(t.deadlineMillis) < now);
          console.log("Old Tasks @@@@", this.pastTasks.length);
        }, error =>{

          if(error.status == 401){
            console.log("Error @@@@@@@", error.status);
          }
          console.log(error.getmessage);

      }
      );
  }

  showCreateMeetingModal(){
    this.createTaskGroupUid = this.groupUid;
    $("#create-meeting-modal").modal("show");
  }

  meetingSaved(saveResponse){
    console.log(saveResponse);
    $("#create-meeting-modal").modal("hide");
    if(saveResponse)
      this.loadTasks();
  }

  showCreateVoteModal(){
    this.createTaskGroupUid = this.groupUid;
    $("#create-vote-modal").modal("show");
  }

  voteSaved(saveResponse){
    console.log(saveResponse);
    $("#create-vote-modal").modal("hide");
    if(saveResponse)
      this.loadTasks();
  }

  showCreateTodoModal(){
    this.createTaskGroupUid = this.groupUid;
    $("#create-todo-modal").modal("show");
  }

  todoSaved(saveResponse){
    console.log(saveResponse);
    $("#create-todo-modal").modal("hide");
    if(saveResponse)
      this.loadTasks();
  }
}
