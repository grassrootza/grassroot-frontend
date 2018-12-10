import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {GroupService} from "../group.service";
import {Group} from "../model/group.model";
import {environment} from "environments/environment";
import {UserService} from "../../user/user.service";

import {AlertService} from "../../utils/alert-service/alert.service";
import { saveAs } from 'file-saver';
import { MembershipInfo } from '../model/membership.model';
import { JoinCodeInfo } from '../model/join-code-info';
import { GroupMinimal, extractFromFull } from '../model/group.minimal.model';

declare var $: any;

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {

  public group: Group = null;
  public currentTab: string = "dashboard";

  public baseUrl: string = environment.backendAppUrl;
  public flyerUrlJpg: string = "";
  public flyerUrlPDF: string = "";
  public xlsDownloadUrl: string = "";

  public groupMinimal: GroupMinimal = null;
  public joinMethodParams: any;
  public isAccountAdmin: boolean = false;
  
  public membership:MembershipInfo;

  public displayName:string;
  
  public canAddToAccount: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService,
              private alertService: AlertService) {

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        if (this.group != null) {
          let uri = ev.urlAfterRedirects;
          let startIndex = uri.indexOf(this.group.groupUid) + this.group.groupUid.length + 1;
          this.currentTab = uri.substring(startIndex);
          if (this.currentTab.indexOf("/") >= 0)
            this.currentTab = this.currentTab.substring(0, this.currentTab.indexOf("/"));
        }
      }
    });

    this.isAccountAdmin = this.userService.getLoggedInUser().hasAccountAdmin();
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let groupUid = params['id'];
      this.alertService.showLoading();
      this.groupService.loadGroupDetailsCached(groupUid, true)
        .subscribe(
          groupDetails => {
            this.group = groupDetails;
            this.canAddToAccount = !this.group.paidFor && this.userService.hasActivePaidAccount();
            this.membership = this.group.members.find(member => member.memberUid == this.userService.getLoggedInUser().userUid);
            this.displayName = this.membership == null ? "" : this.membership.displayName;
            const imageBaseUrl = this.baseUrl.replace('/v2', '') + '/image/flyer/';
            this.flyerUrlJpg = imageBaseUrl + groupUid + "?typeOfFile=JPEG&color=true&language=en";
            this.flyerUrlPDF = imageBaseUrl + groupUid + "?typeOfFile=PDF&color=true&language=en";
            
            this.setupJoinParams();

            this.alertService.hideLoading();
          },
          error => {
            console.log("Error loading groups", error.status)
          }
      );
    });
  }

  exportGroupMembers() {
    this.groupService.downloadGroupMembers(this.group.groupUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/xls' });
      saveAs(blob, this.group.name + ".xlsx");
    }, error => {
      console.log("error getting the file: ", error);
    });
    return false;
  }

  setupJoinParams() {
    this.joinMethodParams = {
      completeJoinCode: environment.ussdPrefix + this.group.joinCode + '#',
      joinWords: this.group.joinWords.map(jw => jw.word).join(", "),
      joinWordsLeft: this.group.joinWordsLeft,
      shortCode: environment.groupShortCode
    };
  }

  joinMethodsModal() {
    if (this.group.hasPermission('GROUP_PERMISSION_SEND_BROADCAST') || this.group.joinWords) {
      this.groupMinimal = extractFromFull(this.group);
      $('#group-join-methods').modal('show');
    }
    return false;
  }

  joinTopicsDone() {
    this.alertService.alert("group.joinMethods.joinTopicsUpdated");
    $('#group-join-methods').modal('hide');
    this.groupService.loadGroupDetailsFromServer(this.group.groupUid).subscribe(group => this.group = group);
  }

  joinWordAdded(word: JoinCodeInfo) {
    console.log('added: ', word);
  }

  joinWordRemoved(word: JoinCodeInfo) {
    console.log('removed: ', word);
  }

  triggerUnsubscribeModal(){
    $('#unsubscribe-modal').modal('show');
    return false;
  }

  unsubscribeFromGroup(){
    this.groupService.unsubscribeUser(this.group.groupUid).subscribe(resp => {
      $('#unsubscribe-modal').modal('hide');
      this.alertService.alert("group.unsubscribe-alert.text", true);
      this.router.navigate(["/groups"]);
    },error => {
      console.log("Error removing user from group",error);
    });
  }

  triggerAliasModal(){
    $('#alias-modal').modal('show');
    return false;
  }

  changeName(alias:string){
    console.log("Changing name in group to:",alias);
    this.groupService.updateMemberAlias(this.group.groupUid,alias).subscribe(resp => {
      console.log("Alias changed.........",resp);
      $('#alias-modal').modal('hide');
      this.alertService.alert("group.alias.alert-text");
      this.displayName = alias;
    },error => {
      console.log("Error updating alias",error);
      this.alertService.alert('group.alias.alert-error');
    });
  }

  addToAccount() {
    this.groupService.addToAccount(this.group.groupUid).subscribe(result => {
      this.alertService.alert('Done! Group added to your account');
      this.group.paidFor = true;
    }, error => {
      console.log('Well, that failed: ', error);
      this.alertService.alert('Sorry, there was an error updating the group');
    })
    return false;
  }

  triggerDeactivateModal() {
    $('#deactivate-modal').modal('show');
    return false;
  }

  deactivateGroup() {
    this.groupService.deactivateGroup(this.group.groupUid).subscribe(() => {
      this.alertService.alert('Done! This group has been deactivated, and will no longer appear after you leave this page');
      $('#deactivate-modal').modal('hide');
    }, error => {
      console.log('Failed to deactivate: ', error);
      this.alertService.alert('Sorry, group deactivation failed. The group may be too big or too old');
      $('#deactivate-modal').modal('hide');
    })
    return false;
  }

  hideGroup() {
    this.groupService.hideGroup(this.group.groupUid).subscribe(() => {
      this.alertService.alert('Done, the group has been hidden. It will no longer appear on your main screen');
      this.group.hidden = true;
      this.groupService.removeGroupCached(this.group.groupUid);
    })
    return false;
  }

  unhideGroup() {
    this.groupService.unhideGroup(this.group.groupUid).subscribe(() => {
      this.alertService.alert('Done, the has been unhidden. It will now appear back on your main screen, menus, etc');
      this.group.hidden = false;
      this.groupService.removeGroupCached(this.group.groupUid);
    })
    return false;
  }

}
