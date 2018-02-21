import { Component, OnInit } from '@angular/core';
import {SearchService} from "../../search.service";
import {ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../../user/user.service";
import {Task} from "../../../task/task.model";

@Component({
  selector: 'app-public-meetings',
  templateUrl: './public-meetings.component.html',
  styleUrls: ['./public-meetings.component.css']
})
export class PublicMeetingsComponent implements OnInit {

  private userUid:string = "";
  private searchTerm:string = "";
  public meetings: Task[] = [];

  constructor(private userService:UserService,
              private route:ActivatedRoute,
              private searchService:SearchService) { }

  ngOnInit() {
    this.userUid = this.userService.getLoggedInUser().userUid;
    this.route.parent.params.subscribe((params:Params) =>{
      this.searchTerm = params['searchTerm'];
      this.loadPublicMeetings(this.searchTerm);
    });
  }

  loadPublicMeetings(searchTerm:string){
    this.searchService.loadPublicMeetings(this.userUid,searchTerm).subscribe(mtgs =>{
      this.meetings = mtgs;
      console.log("Public Meetings..........",this.meetings);
    },error =>{
      console.log("Error loading public meetings.......",error);
    });
  }

}
