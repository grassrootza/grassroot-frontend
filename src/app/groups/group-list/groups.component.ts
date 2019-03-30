import {Component, OnInit, Inject, PLATFORM_ID, OnDestroy} from '@angular/core';
import {GroupService} from "../group.service";
import {GroupInfo} from "../model/group-info.model";
import {GroupRef} from "../model/group-ref.model";
import {Router} from "@angular/router";
import {AlertService} from "../../utils/alert-service/alert.service";
import {TranslateService} from "@ngx-translate/core";
import { filter, takeUntil } from 'rxjs/operators';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';
import { UpdateService } from 'app/utils/update.service';

declare var $: any;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit, OnDestroy {

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

  private sortByNameAsc = true;
  private sortByRoleNameAsc = true;
  private sortByMemberCountAsc = true;
  private sortByUpNextAsc = true;

  public createTaskGroupUid: string = null;
  updateAvailable = false;
  destroy$: Subject<void> = new Subject<void>();

  constructor(private groupService: GroupService,
              private alertService: AlertService,
              private router: Router,
              private translateService: TranslateService,
              private updateService: UpdateService,
              @Inject(PLATFORM_ID) protected platformId: Object,
              @Inject(DOCUMENT) private document: Document,) {
  }

  ngOnInit() {

    this.alertService.showLoading();

    this.groupService.groupInfoList.subscribe(
      groupList => {
        if (groupList) {
          // console.log("Groups loaded: ", groupList);
          this.alertService.hideLoadingDelayed();

          this.groups = groupList;
          this.resolvePinnedGroups();

          this.filteredGroups = this.groups;
          this.filteredGroupsPage = this.filteredGroups.slice(0, this.pageSize);
          this.totalCount = this.filteredGroups.length;
          this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
          this.currentPage = 1;
          this.generatePageList(this.numberOfPages);
        }
      }
    );

    this.groupService.groupInfoListError
      .subscribe(
        error => {
          if (error) {
            console.log("Failed to fetch group list!", error);
            this.alertService.hideLoadingDelayed();
          }
        }
      );

    this.groupService.loadGroups();

    // subscribe to the changes of the dataGroup 'groupList' sent by the SW
    this.updateService.dataGroupUpdate$.pipe(
      filter(dataGroup => dataGroup === 'groupList'),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.updateAvailable = true;
    });
  }

  private resolvePinnedGroups() {
    this.pinnedGroups = this.groups.filter(gr => gr.pinned)
  }

  trackByGroupId(index, group: GroupInfo) {
    return group.groupUid;
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

  refreshPage() {
    if (isPlatformBrowser(this.platformId)) {
      this.document.location.reload();
    }
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
    this.translateService.get('enum.GroupRole.' + roleDisplayName).subscribe(translation => {
      this.pickedRoleFilter = translation;
      $("#dropdownMenuButton").html(translation);
    });
    this.generatePageList(this.numberOfPages);
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

  resetSortIcons(): void {
    $('#sortByNamePlaceHolder').children()[0].remove();
    $('#sortByNamePlaceHolder').append('<i class="fa fa-sort"></i>');

    $('#sortByRolePlaceHolder').children()[0].remove();
    $('#sortByRolePlaceHolder').append('<i class="fa fa-sort"></i>');

    $('#sortByUpNextPlaceHolder').children()[0].remove();
    $('#sortByUpNextPlaceHolder').append('<i class="fa fa-sort"></i>');

    $('#sortByMembersCountPlaceHolder').children()[0].remove();
    $('#sortByMembersCountPlaceHolder').append('<i class="fa fa-sort"></i>');
  }

  resetPinnedSortIcons(): void {
    if(this.pinnedGroups.length > 0){
      $('#pinnedSortByNamePlaceHolder').children()[0].remove();
      $('#pinnedSortByNamePlaceHolder').append('<i class="fa fa-sort"></i>');

      $('#pinnedSortByRolePlaceHolder').children()[0].remove();
      $('#pinnedSortByRolePlaceHolder').append('<i class="fa fa-sort"></i>');

      $('#pinnedSortByUpNextPlaceHolder').children()[0].remove();
      $('#pinnedSortByUpNextPlaceHolder').append('<i class="fa fa-sort"></i>');

      $('#pinnedSortByMembersCountPlaceHolder').children()[0].remove();
      $('#pinnedSortByMembersCountPlaceHolder').append('<i class="fa fa-sort"></i>');
    }

  }

  sortByGroupName(pinned: boolean): void {
    let sortedList: GroupInfo[] = [];
    if(pinned){
      this.pinnedGroups.forEach(pg => sortedList.push(pg));
    } else {
      this.filteredGroups.forEach(ft => sortedList.push(ft));
    }
    this.resetPinnedSortIcons();
    this.resetSortIcons();

    if(this.sortByNameAsc) {
      this.sortByNameAsc = !this.sortByNameAsc;

      if(pinned) {
        $('#pinnedSortByNamePlaceHolder').children()[0].remove();
        $('#pinnedSortByNamePlaceHolder').append('<i class="fa fa-sort-down"></i>');
      } else {
        $('#sortByNamePlaceHolder').children()[0].remove();
        $('#sortByNamePlaceHolder').append('<i class="fa fa-sort-down"></i>');
      }

      sortedList.sort(function(a, b){
        const nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
        if (nameA < nameB)
          return 1;
        else if (nameA > nameB)
          return -1;
        else
          return 0;
      });
    } else {
      this.sortByNameAsc = !this.sortByNameAsc;

      if(pinned) {
        $('#pinnedSortByNamePlaceHolder').children()[0].remove();
        $('#pinnedSortByNamePlaceHolder').append('<i class="fa fa-sort-up"></i>');
      } else {
        $('#sortByNamePlaceHolder').children()[0].remove();
        $('#sortByNamePlaceHolder').append('<i class="fa fa-sort-up"></i>');
      }
      sortedList.sort(function(a, b){
        const nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
        if (nameA > nameB)
          return 1;
        else if (nameA < nameB)
          return -1;
        else
          return 0;
      });
    }

    if(!pinned) {
      this.totalCount = sortedList.length;
      this.filteredGroupsPage = sortedList.slice(0,this.pageSize);
      this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
      this.currentPage = 1;
      this.generatePageList(this.numberOfPages);
    }
  }

  sortByRoleName(pinned: boolean): void {
    let sortedList: GroupInfo[] = [];
    if(pinned){
      this.pinnedGroups.forEach(pg => sortedList.push(pg));
    } else {
      this.filteredGroups.forEach(ft => sortedList.push(ft));
    }
    this.resetPinnedSortIcons();
    this.resetSortIcons();
    if(this.sortByRoleNameAsc) {
      this.sortByRoleNameAsc = !this.sortByRoleNameAsc;
      if(pinned) {
        $('#pinnedSortByRolePlaceHolder').children()[0].remove();
        $('#pinnedSortByRolePlaceHolder').append('<i class="fa fa-sort-down"></i>');
      } else {
        $('#sortByRolePlaceHolder').children()[0].remove();
        $('#sortByRolePlaceHolder').append('<i class="fa fa-sort-down"></i>');
      }
      sortedList.sort(function(a, b){
        const roleA=a.userRole.toLowerCase(), roleB=b.userRole.toLowerCase();
        if (roleA < roleB)
          return 1;
        else if (roleA > roleB)
          return -1;
        else
          return 0;
      });
    } else {
      this.sortByRoleNameAsc = !this.sortByRoleNameAsc;
      if(pinned) {
        $('#pinnedSortByRolePlaceHolder').children()[0].remove();
        $('#pinnedSortByRolePlaceHolder').append('<i class="fa fa-sort-up"></i>');
      } else {
        $('#sortByRolePlaceHolder').children()[0].remove();
        $('#sortByRolePlaceHolder').append('<i class="fa fa-sort-up"></i>');
      }
      sortedList.sort(function(a, b){
        const roleA=a.userRole.toLowerCase(), roleB=b.userRole.toLowerCase();
        if (roleA > roleB)
          return 1;
        else if (roleA < roleB)
          return -1;
        else
          return 0;
      });
    }
    if(!pinned) {
      this.totalCount = sortedList.length;
      this.filteredGroupsPage = sortedList.slice(0,this.pageSize);
      this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
      this.currentPage = 1;
      this.generatePageList(this.numberOfPages);
    }

  }

  sortByUpNext(pinned: boolean): void {
    let sortedList: GroupInfo[] = [];
    if(pinned){
      this.pinnedGroups.forEach(pg => sortedList.push(pg));
    } else {
      this.filteredGroups.forEach(ft => sortedList.push(ft));
    }
    this.resetPinnedSortIcons();
    this.resetSortIcons();
    if(this.sortByUpNextAsc) {
      this.sortByUpNextAsc = !this.sortByUpNextAsc;
      if(pinned){
        $('#pinnedSortByUpNextPlaceHolder').children()[0].remove();
        $('#pinnedSortByUpNextPlaceHolder').append('<i class="fa fa-sort-down"></i>');
      }else{
        $('#sortByUpNextPlaceHolder').children()[0].remove();
        $('#sortByUpNextPlaceHolder').append('<i class="fa fa-sort-down"></i>');
      }
      sortedList.sort(function(a, b){
        const event1=a.nextEventTime, event2=b.nextEventTime;
        if (event1 < event2)
          return 1;
        else if (event1 > event2)
          return -1;
        else
          return 0;
      });
    } else {
      this.sortByUpNextAsc = !this.sortByUpNextAsc;
      if(pinned){
        $('#pinnedSortByUpNextPlaceHolder').children()[0].remove();
        $('#pinnedSortByUpNextPlaceHolder').append('<i class="fa fa-sort-up"></i>');
      }else{
        $('#sortByUpNextPlaceHolder').children()[0].remove();
        $('#sortByUpNextPlaceHolder').append('<i class="fa fa-sort-up"></i>');
      }
      sortedList.sort(function(a, b){
        const event1=a.nextEventTime, event2=b.nextEventTime;
        if (event1 > event2)
          return 1;
        else if (event1 < event2)
          return -1;
        else
          return 0;
      });
    }
    if(!pinned){
      this.totalCount = sortedList.length;
      this.filteredGroupsPage = sortedList.slice(0,this.pageSize);
      this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
      this.currentPage = 1;
      this.generatePageList(this.numberOfPages);
    }
    console.log(this.filteredGroups);
    console.log(sortedList);
  }

  sortByMembersCount(pinned: boolean): void {
    let sortedList: GroupInfo[] = [];
    if(pinned){
      this.pinnedGroups.forEach(pg => sortedList.push(pg));
    } else {
      this.filteredGroups.forEach(ft => sortedList.push(ft));
    }
    this.resetPinnedSortIcons();
    this.resetSortIcons();
    if(this.sortByMemberCountAsc) {
      this.sortByMemberCountAsc = !this.sortByMemberCountAsc;
      if(pinned){
        $('#pinnedSortByMembersCountPlaceHolder').children()[0].remove();
        $('#pinnedSortByMembersCountPlaceHolder').append('<i class="fa fa-sort-down"></i>');
      }else{
        $('#sortByMembersCountPlaceHolder').children()[0].remove();
        $('#sortByMembersCountPlaceHolder').append('<i class="fa fa-sort-down"></i>');
      }
      sortedList.sort(function(a, b){
        const count1=a.memberCount, count2=b.memberCount;
        if (count1 < count2)
          return 1;
        else if (count1 > count2)
          return -1;
        else
          return 0;
      });
    } else {
      this.sortByMemberCountAsc = !this.sortByMemberCountAsc;
      if(pinned){
        $('#pinnedSortByMembersCountPlaceHolder').children()[0].remove();
        $('#pinnedSortByMembersCountPlaceHolder').append('<i class="fa fa-sort-up"></i>');
      }else{
        $('#sortByMembersCountPlaceHolder').children()[0].remove();
        $('#sortByMembersCountPlaceHolder').append('<i class="fa fa-sort-up"></i>');
      }
      sortedList.sort(function(a, b){
        const count1=a.memberCount, count2=b.memberCount;
        if (count1 > count2)
          return 1;
        else if (count1 < count2)
          return -1;
        else
          return 0;
      });
    }
    if(!pinned){
      this.totalCount = sortedList.length;
      this.filteredGroupsPage = sortedList.slice(0,this.pageSize);
      this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
      this.currentPage = 1;
      this.generatePageList(this.numberOfPages);
    }
  }

  clearAllFilters(): void {
    this.filteredGroups = this.groups;
    this.filteredGroupsPage = this.filteredGroups.slice(0,this.pageSize);
    this.totalCount = this.filteredGroups.length;
    this.numberOfPages = Math.ceil(this.totalCount / this.pageSize);
    this.currentPage = 1;
    this.pickedRoleFilter = '';
    this.generatePageList(this.numberOfPages);
    $("#dropdownMenuButton").html('Select a role');
    $("#inlineKeywordPick").val("");

    this.resetSortIcons();
    this.resetPinnedSortIcons();

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
    this.groupService.loadGroups();
    this.router.navigate(["/group", groupRef.groupUid]);
  }

  groupCreationFailed(error: any) {
    console.log("Failed to create group. Error: ", error)
  }

  showGroup(group: GroupInfo) {
    this.alertService.showLoading();
    this.router.navigate(["/group", group.groupUid]);
  }

  showCreateMeetingModal(group: GroupInfo) {
    console.log("Show create meeting modal for group: " + group.groupUid);
    this.createTaskGroupUid = group.groupUid;
    $("#create-meeting-modal").modal("show");
  }

  meetingSaved(saveResponse) {
    console.log(saveResponse);
    $("#create-meeting-modal").modal("hide");
  }

  showCreateVoteModal(group: GroupInfo) {
    this.createTaskGroupUid = group.groupUid;
    $("#create-vote-modal").modal("show");
  }

  voteSaved(saveResponse) {
    console.log(saveResponse);
    $("#create-vote-modal").modal("hide");
  }

  showCreateTodoModal(group: GroupInfo) {
    this.createTaskGroupUid = group.groupUid;
    $("#create-todo-modal").modal("show");
  }

  todoSaved(saveResponse) {
    console.log(saveResponse);
    $("#create-todo-modal").modal("hide");
  }

  showCreateLivewireAlertModal(group: GroupInfo){
      this.createTaskGroupUid = group.groupUid;
      $("#create-livewire-alert-modal").modal("show");
  }

  alertSaved(saveResponse){
    $("#create-livewire-alert-modal").modal("hide");
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
