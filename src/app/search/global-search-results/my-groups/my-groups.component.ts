import {Component, Input, OnInit} from '@angular/core';
import {SearchService} from "../../search.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../../user/user.service";
import {GroupInfo} from "../../../groups/model/group-info.model";
import {Group} from "../../../groups/model/group.model";

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {

  private userUid:string = "";
  private searchTerm:string = "";
  public filteredGroups:GroupInfo[] = [];
  public groups:Group[] = [];
  public group:Group = null;

  protected pageSize: number = 10;
  protected numberOfPages: number = 1;
  protected totalCount: number = 0;
  public pagesList: number[] = [];
  protected filteredGroupsPage: Group[] = [];
  protected currentPage: number = 1;

  @Input()
  public groupInfo: GroupInfo = null;

  constructor(private userService:UserService,
              private route:ActivatedRoute,
              private searchService:SearchService,
              private router:Router) { }

  ngOnInit() {
    this.userUid = this.userService.getLoggedInUser().userUid;
    this.route.parent.params.subscribe((params:Params) =>{
      this.searchTerm = params['searchTerm'];

      this.loadUserGroups(this.searchTerm);

    });
  }

  loadUserGroupsWithSearchTerm(searchTerm:string){
    this.searchService.loadUserGroupsUsingSearchTerm(searchTerm).subscribe(groups =>{
      this.filteredGroups = groups;
      console.log("User groups...........",this.filteredGroups);
    },error => {
      console.log("Error...........",error);
    });
  }

  loadUserGroups(searchTerm:string){
    this.searchService.loadUserGroups(searchTerm).subscribe(grps =>{
      this.groups = grps;
      console.log("Groups............",this.groups);

      this.filteredGroupsPage = this.groups.slice(0,this.pageSize);
      this.totalCount = this.groups.length;
      this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
      this.currentPage = 1;
      this.generatePageList(this.numberOfPages);

      console.log("Pages.....",this.numberOfPages)
    },error => {
      console.log("Error.........",error)
    })
  }

  triggerViewGroup(groupInfo:GroupInfo){
    console.log("View group details....................",groupInfo);

    this.router.navigate(["/group", groupInfo.groupUid]);
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
    this.filteredGroupsPage = this.groups.slice(this.pageSize*(page-1), this.pageSize*page);
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
