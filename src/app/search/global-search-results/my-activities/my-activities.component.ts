import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../user/user.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Task} from '../../../task/task.model'
import {SearchService} from "../../search.service";
import {TaskService} from "../../../task/task.service";

declare var $: any;

@Component({
  selector: 'app-my-activities',
  templateUrl: './my-activities.component.html',
  styleUrls: ['./my-activities.component.css', '../global-search-results.component.css']
})
export class MyActivitiesComponent implements OnInit {

  private userUid:string = "";
  private searchTerm:string = "";
  public userTasksFiltered: Task[];

  public taskToView:Task = null;

  public voteResponse:string = "";

  protected pageSize: number = 10;
  protected numberOfPages: number = 1;
  protected totalCount: number = 0;
  public pagesList: number[] = [];
  protected filteredTasksPage: Task[] = [];
  protected currentPage: number = 1;

  constructor(private userService:UserService,
              private route:ActivatedRoute,
              private searchService:SearchService,
              private taskService:TaskService) { }

  ngOnInit() {
    this.userUid = this.userService.getLoggedInUser().userUid;
    this.route.parent.params.subscribe((params:Params) =>{
      this.searchTerm = params['searchTerm'];
      this.loadUserTasksWithSearchTerm(this.searchTerm);
      console.log("Filtered tasks....",this.userTasksFiltered)
    });
  }

  loadUserTasksWithSearchTerm(searchTerm:string){
    this.searchService.loadUserTasksUsingSearchTerm(searchTerm).subscribe(resp => {
        console.log("Response....................",resp);
        this.userTasksFiltered = resp;

        this.filteredTasksPage = this.userTasksFiltered.slice(0,this.pageSize);
        this.totalCount = this.userTasksFiltered.length;
        this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = 1;
        this.generatePageList(this.numberOfPages);
    });
  }

  triggerViewTask(task:Task){
    this.taskToView = task;
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

  generatePageList(numberOfPages: number){
    this.pagesList = [];
    for(let i=1;i<=numberOfPages;i++){
      this.pagesList.push(i);
    }
  }

  goToPage(page: number){
    this.currentPage = page;
    this.filteredTasksPage = this.userTasksFiltered.slice(this.pageSize*(page-1), this.pageSize*page);
  }

  previousPage(){
    if(this.currentPage != 1){
      this.currentPage = this.currentPage-1;
      this.goToPage(this.currentPage);
    }
  }

  nextPage(){
    if(this.currentPage != this.numberOfPages){
      this.currentPage = this.currentPage+1;
      this.goToPage(this.currentPage);
    }
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
