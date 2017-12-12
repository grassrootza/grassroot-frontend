import {Component, OnInit} from '@angular/core';
import {TaskService} from "../../../task/task.service";
import {TaskType} from "../../../task/task-type";
import {ActivatedRoute, Params} from "@angular/router";
import {Task} from "../../../task/task.model";

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

  constructor(private taskService: TaskService, private route: ActivatedRoute) {
  }

  ngOnInit() {

    this.route.parent.params.subscribe((params: Params) => {
      console.log("Activated route params: ", params);
      this.groupUid = params['id'];
      console.log("Tasks Group id: ", this.groupUid);
      this.loadTasks();
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
}
