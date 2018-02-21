import { Component, OnInit } from '@angular/core';
import {SearchService} from "../../search.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {UserService} from "../../../user/user.service";
import {Group} from "../../../groups/model/group.model";

@Component({
  selector: 'app-public-groups',
  templateUrl: './public-groups.component.html',
  styleUrls: ['./public-groups.component.css']
})
export class PublicGroupsComponent implements OnInit {

  private userUid:string = "";
  private searchTerm:string = "";
  public groups:Group[] = [];

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
    },error =>{
      console.log("Error loading public groups..............",error);
    })
  }

}
