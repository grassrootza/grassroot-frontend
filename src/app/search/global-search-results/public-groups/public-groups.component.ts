import { Component, OnInit } from '@angular/core';
import {SearchService} from "../../search.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../../user/user.service";
import {Group} from "../../../groups/model/group.model";

declare var $: any;
@Component({
  selector: 'app-public-groups',
  templateUrl: './public-groups.component.html',
  styleUrls: ['./public-groups.component.css']
})
export class PublicGroupsComponent implements OnInit {

  private userUid:string = "";
  private searchTerm:string = "";
  public groups:Group[] = [];


  protected pageSize: number = 10;
  protected numberOfPages: number = 1;
  protected totalCount: number = 0;
  public pagesList: number[] = [];
  protected filteredPublicGroupsPage: Group[] = [];
  protected currentPage: number = 1;

  public groupUid:string = "";

  constructor(private searchService:SearchService,
              private route:ActivatedRoute,
              private router:Router,
              private userService:UserService) { }

  ngOnInit() {
    this.userUid = this.userService.getLoggedInUser().userUid;
    this.route.parent.params.subscribe((params:Params) =>{
      this.searchTerm = params['searchTerm'];
      this.loadPublicGroups(this.searchTerm);
    });
  }

  loadPublicGroups(searchTerm:string){
    this.searchService.loadPublicGroups(this.userUid,this.searchTerm).subscribe(grps=>{
      console.log("Public Groups...................",grps);
      this.groups = grps;

      this.filteredPublicGroupsPage = this.groups.slice(0,this.pageSize);
      this.totalCount = this.groups.length;
      this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
      this.currentPage = 1;
      this.generatePageList(this.numberOfPages);

    },error =>{
      console.log("Error loading public groups..............",error);
    })
  }

  setGroup(group:Group){
    this.groupUid = group.groupUid;
    console.log("Group uid for group to be joined...........",this.groupUid);
  }

  joinGroup(joinWord:string){
    console.log("Asking to join group.......",this.groupUid);
    console.log("With join word..........",joinWord);
    this.searchService.askToJoinGroup(this.groupUid,joinWord).subscribe(resp =>{
      console.log("Group joined............",resp);
      $("#join-group-modal").modal("hide");
    },error =>{
      console.log("Error joining a group",error);
    })
  }

  generatePageList(numberOfPages: number){
    this.pagesList = [];
    for(let i=1;i<=numberOfPages;i++){
      this.pagesList.push(i);
    }
  }

  goToPage(page: number){
    this.currentPage = page;
    this.filteredPublicGroupsPage = this.groups.slice(this.pageSize*(page-1), this.pageSize*page);
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

}
