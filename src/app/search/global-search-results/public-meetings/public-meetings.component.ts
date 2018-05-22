import { Component, OnInit } from '@angular/core';
import {SearchService} from "../../search.service";
import {ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../../user/user.service";
import {Task} from "../../../task/task.model";
import {TaskInfo} from "../../../task/task-info.model";
import { AlertService } from '../../../utils/alert-service/alert.service';

declare var $: any;

@Component({
  selector: 'app-public-meetings',
  templateUrl: './public-meetings.component.html',
  styleUrls: ['./public-meetings.component.css', '../global-search-results.component.css']
})
export class PublicMeetingsComponent implements OnInit {

  private userUid:string = "";
  private searchTerm:string = "";
  public meetings: TaskInfo[];
  public taskToView: Task;

  protected pageSize: number = 10;
  protected numberOfPages: number = 1;
  protected totalCount: number = 0;
  public pagesList: number[] = [];
  protected filteredMeetingsPage: TaskInfo[] = [];
  protected currentPage: number = 1;

  constructor(private userService:UserService,
              private route:ActivatedRoute,
              private searchService:SearchService,
              private alertService:AlertService) { }

  ngOnInit() {
    this.alertService.showLoading();
    this.userUid = this.userService.getLoggedInUser().userUid;
    this.route.parent.params.subscribe((params:Params) =>{
      this.searchTerm = params['searchTerm'];
      this.loadPublicMeetings(this.searchTerm);
      this.alertService.hideLoadingDelayed();
    });
  }

  loadPublicMeetings(searchTerm:string){
    this.searchService.loadPublicMeetings(searchTerm).subscribe(mtgs =>{
      this.meetings = mtgs;
      console.log("Public Meetings..........",this.meetings);

      this.filteredMeetingsPage = this.meetings.slice(0,this.pageSize);
      this.totalCount = this.meetings.length;
      this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
      this.currentPage = 1;
      this.generatePageList(this.numberOfPages);

    },error =>{
      console.log("Error loading public meetings.......",error);
    });
  }

  generatePageList(numberOfPages: number){
    this.pagesList = [];
    for(let i=1;i<=numberOfPages;i++){
      this.pagesList.push(i);
    }
  }

  goToPage(page: number){
    this.currentPage = page;
    this.filteredMeetingsPage = this.meetings.slice(this.pageSize*(page-1), this.pageSize*page);
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

  triggerMeeting(meeting:Task){
    this.taskToView = meeting;
    $("#view-meeting-modal").modal("show");
    return false;
  }

}
