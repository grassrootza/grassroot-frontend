import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../user/user.service';
import {GroupService} from '../../group.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskService} from '../../../task/task.service';
import {Task} from '../../../task/task.model';
import {TaskType} from '../../../task/task-type';
import {NgbDateTimeStruct} from '@zhaber/ng-bootstrap-datetimepicker';
import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {CreateMeetingComponent} from './create-meeting/create-meeting.component';
import {CreateVoteComponent} from './create-vote/create-vote.component';
import {CreateTodoComponent} from './create-todo/create-todo.component';

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
  model: NgbDateTimeStruct;



  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService,
              private taskService: TaskService) {


  }


  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.groupUid = params['id'];
      this.loadTasks();
    });
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

  showCreateMeetingModal(){
    $("#create-meeting-modal").modal("show");
  }

  meetingSaved(saveResponse){
    console.log(saveResponse);
    $("#create-meeting-modal").modal("hide");
    if(saveResponse)
      this.loadTasks();
  }

  showCreateVoteModal(){
    $("#create-vote-modal").modal("show");
  }

  voteSaved(saveResponse){
    console.log(saveResponse);
    $("#create-vote-modal").modal("hide");
    if(saveResponse)
      this.loadTasks();
  }

  showCreateTodoModal(){
    $("#create-todo-modal").modal("show");
  }

  todoSaved(saveResponse){
    console.log(saveResponse);
    $("#create-todo-modal").modal("hide");
    if(saveResponse)
      this.loadTasks();
  }
}
