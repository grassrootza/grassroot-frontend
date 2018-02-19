import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../user/user.service";
import {ActivatedRoute, Params} from "@angular/router";
import {Task} from 'app/task/task.model';
import {SearchService} from "../../search.service";

@Component({
  selector: 'app-my-activities',
  templateUrl: './my-activities.component.html',
  styleUrls: ['./my-activities.component.css']
})
export class MyActivitiesComponent implements OnInit {

  private userUid:string = "";
  private searchTerm:string = "";
  public userTasksFiltered: Task[] = [];

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
