import {Component, OnInit} from '@angular/core';
import {GroupService} from "../group.service";
import {GroupInfo} from "../model/group-info.model";
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {GroupRef} from "../model/group-ref.model";

declare var $: any;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  // aot build doesn't like these being private, wants them public
  public groups: GroupInfo[] = [];
  public pinnedGroups: GroupInfo[] = [];
  public pagesList: number[] = [];

  protected currentPage: number = 1;
  protected totalCount: number = 0;
  protected pageSize: number = 10;
  protected numberOfPages: number = 1;
  protected filteredGroups: GroupInfo[] = [];
  protected filteredGroupsPage: GroupInfo[] = [];
  protected pickedRoleFilter: String = '';

  constructor(private groupService: GroupService,
    private spinnerService: Ng4LoadingSpinnerService) {
  }

  ngOnInit() {
    this.groupService.groupInfoList.subscribe(
      groupList => {
        console.log("Groups loaded: ", groupList);
        this.spinnerService.hide();

        this.groups = groupList;
        this.resolvePinnedGroups();

        this.filteredGroups = this.groups;
        this.filteredGroupsPage = this.filteredGroups.slice(0,this.pageSize);
        this.totalCount = this.filteredGroups.length;
        this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = 1;
        this.generatePageList(this.numberOfPages);
      }
    );

    this.spinnerService.show(); // todo: possibly only show if cache is empty
    this.groupService.loadGroups(true);
  }


  private resolvePinnedGroups() {
    this.pinnedGroups = this.groups.filter(gr => gr.pinned)
  }


  toggleGroupPin(gr: GroupInfo) {
    if (gr.pinned)
      this.unpinGroup(gr);
    else
      this.pinGroup(gr);
  }

  pinGroup(gr: GroupInfo) {
    this.groupService.pinGroup(gr.groupUid).subscribe(
      success => {
        console.log("pin group success: ", success);
        gr.pinned = true;
        this.resolvePinnedGroups()
      });
  }

  unpinGroup(gr: GroupInfo) {
    this.groupService.unpinGroup(gr.groupUid).subscribe(
      success => {
        console.log("unpin group success: ", success);
        gr.pinned = false;
        this.resolvePinnedGroups()
      });
  }



  generatePageList(numberOfPages: number){
    this.pagesList = [];
    for(let i=1;i<=numberOfPages;i++){
      this.pagesList.push(i);
    }
  }

  filterGroupsByRole(roleDisplayName: String): void{
    console.log("filter");
    this.filteredGroups = this.groups.filter(group => group.userRole === roleDisplayName);
    this.totalCount = this.filteredGroups.length;
    this.filteredGroupsPage = this.filteredGroups.slice(0,this.pageSize);
    this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
    this.currentPage = 1;
    this.pickedRoleFilter = roleDisplayName;

    this.generatePageList(this.numberOfPages);
    $("#dropdownMenuButton").html(roleDisplayName);
  }

  filterByKeyword(): void{
    let keyword = $('#inlineKeywordPick').val();
    if(keyword !== ''){
      this.filteredGroups = this.groups.filter(group =>
        group.name.toLowerCase().indexOf(keyword.toLowerCase()) !== -1 || group.description.toLowerCase().indexOf(keyword.toLowerCase()) !== -1
      );
    }else{
      this.filteredGroups = this.groups;
    }

    if(this.pickedRoleFilter !== ''){
      this.filteredGroups = this.filteredGroups.filter(group => group.userRole === this.pickedRoleFilter);
    }
    this.totalCount = this.filteredGroups.length;
    this.filteredGroupsPage = this.filteredGroups.slice(0,this.pageSize);
    this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
    this.currentPage = 1;

    this.generatePageList(this.numberOfPages);
  }

  clearAllFilters(): void {
    this.filteredGroups = this.groups;
    this.filteredGroupsPage = this.filteredGroups.slice(0,this.pageSize);
    this.totalCount = this.filteredGroups.length;
    this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
    this.currentPage = 1;
    this.pickedRoleFilter = '';
    this.generatePageList(this.numberOfPages);
    $("#dropdownMenuButton").html('Select role');
    $("#inlineKeywordPick").val("");

  }

  goToPage(page: number){
    this.currentPage = page;
    this.filteredGroupsPage = this.filteredGroups.slice(this.pageSize*(page-1), this.pageSize*page);
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

  groupCreated(groupRef: GroupRef) {
    console.log("Group successfully created, groupUid: ", groupRef.groupUid);
    this.groupService.loadGroups(true);
  }

  groupCreationFailed(error: any) {
    console.log("Failed to create group. Error: ", error)
  }

}
