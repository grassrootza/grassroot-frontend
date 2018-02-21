import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserService} from "../../../user/user.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Task} from 'app/task/task.model';
import {SearchService} from "../../search.service";
declare var $: any;

@Component({
  selector: 'app-my-activities',
  templateUrl: './my-activities.component.html',
  styleUrls: ['./my-activities.component.css']
})
export class MyActivitiesComponent implements OnInit {

  private userUid:string = "";
  private searchTerm:string = "";
  public userTasksFiltered: Task[] = [];

  public taskToView:Task = null;

  constructor(private userService:UserService,
              private route:ActivatedRoute,
              private searchService:SearchService) { }

  ngOnInit() {
    this.userUid = this.userService.getLoggedInUser().userUid;
    this.route.parent.params.subscribe((params:Params) =>{
      this.searchTerm = params['searchTerm'];
      this.loadUserTasksWithSearchTerm(this.searchTerm);
      console.log("Filtered tasks....",this.userTasksFiltered)
    });
  }

  loadUserTasksWithSearchTerm(searchTerm:string){
    this.searchService.loadUserTasksUsingSearchTerm(this.userUid,searchTerm).subscribe(resp => {
        console.log("Response....................",resp);
        this.userTasksFiltered = resp;
    });
  }

  triggerViewTask(task:Task){
    this.taskToView = task;
    console.log("Task Var...",this.taskToView);
    console.log("Task...",task);
    console.log("Task to view........",task.taskUid);

    switch (task.type){
      case "MEETING":
        $("#view-meeting-modal").modal("show");
        break;
      case "VOTE":
        $("#view-vote-modal").modal("show");
        break;
      case "TODO":
        $("#view-todo-modal").modal("show");
        break;
    }

    return false;
  }


/*  loadUserGroupsUsingSearchTerm(searchTerm:string){
    this.groupService.groupInfoList.subscribe(groups => {
      this.groupsFiltered =
        groups.filter(group =>
          group.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
          group.description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
      console.log("Filtered groups..............",this.groupsFiltered);
    });
  }*/

}
