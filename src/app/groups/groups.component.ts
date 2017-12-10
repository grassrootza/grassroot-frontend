import {Component, OnInit} from '@angular/core';
import {GroupService} from "./group.service";
import {GroupInfo} from "./model/group-info.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

declare var $: any;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {


  protected groups: GroupInfo[] = [];
  protected pinnedGroups: GroupInfo[] = [];

  protected currentPage: number = 1;
  protected totalCount: number = 0;
  protected pageSize: number = 10;
  protected numberOfPages: number = 1;
  protected filteredGroups: GroupInfo[] = [];
  protected filteredGroupsPage: GroupInfo[] = [];
  protected pagesList: number[] = [];
  protected pickedRoleFilter: String = '';


  public createGroupForm: FormGroup;

  constructor(private groupService: GroupService, private formBuilder: FormBuilder) {

    this.createGroupForm = formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': '',
      'discoverable': 'true',
      'permissionTemplate': 'DEFAULT_GROUP',
      'reminderMinutes': [0, Validators.pattern("[0-9]+")]
    });
  }

  ngOnInit() {
    this.groupService.groupInfoList.subscribe(
      groupList => {
        console.log("Groups loaded: ", groupList);
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
    this.groupService.loadGroups()
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
    this.groupService.pinGroup(gr.uid).subscribe(
      success => {
        console.log("pin group success: ", success);
        gr.pinned = true;
        this.resolvePinnedGroups()
      });
  }

  unpinGroup(gr: GroupInfo) {
    this.groupService.unpinGroup(gr.uid).subscribe(
      success => {
        console.log("unpin group success: ", success);
        gr.pinned = false;
        this.resolvePinnedGroups()
      });
  }

  createGroup() {

    $('#create-group-modal').modal("hide");
    if (this.createGroupForm.valid) {
      let groupName: string = this.createGroupForm.get("name").value;
      let groupDescription: string = this.createGroupForm.get("description").value;
      let groupPermission: string = this.createGroupForm.get("permissionTemplate").value;
      let reminderMinutes: number = this.createGroupForm.get("reminderMinutes").value;
      let discoverable: string = this.createGroupForm.get("discoverable").value;
      this.groupService.createGroup(groupName, groupDescription, groupPermission, reminderMinutes, discoverable)
        .subscribe(
          groupUid => {
            console.log("Group successfully created, uid: ", groupUid);
            this.groupService.loadGroups();
          },
          error => {
            console.log("Error creating group: ", error);
          }
        )
    }
    else {
      console.log("Create group form invalid!");
    }
  }

  generatePageList(numberOfPages: number){
    this.pagesList = [];
    for(let i=1;i<=numberOfPages;i++){
      this.pagesList.push(i);
    }
  }

  filterGroupsByRole(role: String, roleDisplayName: String): void{
    this.filteredGroups = this.groups.filter(group =>  group.role === role );
    this.totalCount = this.filteredGroups.length;
    this.filteredGroupsPage = this.filteredGroups.slice(0,this.pageSize);
    this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
    this.currentPage = 1;
    this.pickedRoleFilter = role;

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
      this.filteredGroups = this.filteredGroups.filter(group =>  group.role === this.pickedRoleFilter );
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

}
