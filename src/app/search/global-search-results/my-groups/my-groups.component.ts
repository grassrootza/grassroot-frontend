import { Component, OnInit } from '@angular/core';
import {SearchService} from "../../search.service";
import {ActivatedRoute, Params} from "@angular/router";
import {UserService} from "../../../user/user.service";
import {GroupInfo} from "../../../groups/model/group-info.model";
import {Group} from "../../../groups/model/group.model";
import {GroupService} from "../../../groups/group.service";

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

  constructor(private userService:UserService,
              private route:ActivatedRoute,
              private searchService:SearchService) { }

  ngOnInit() {
    this.userUid = this.userService.getLoggedInUser().userUid;
    this.route.parent.params.subscribe((params:Params) =>{
      this.searchTerm = params['searchTerm'];
      this.loadUserGroupsWithSearchTerm(this.searchTerm);
      this.loadUserGroups(this.searchTerm);
    });
  }

  loadUserGroupsWithSearchTerm(searchTerm:string){
    this.searchService.loadUserGroupsUsingSearchTerm(this.userUid,searchTerm).subscribe(groups =>{
      this.filteredGroups = groups;
      console.log("User groups...........",this.filteredGroups);
    },error => {
      console.log("Error...........",error);
    });
  }

  loadUserGroups(searchTerm:string){
    this.searchService.loadUserGroups(this.userUid,searchTerm).subscribe(grps =>{
      this.groups = grps;
      console.log("Groups............",this.groups);
    },error => {
      console.log("Error.........",error)
    })
  }
}
