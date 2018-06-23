import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {GroupService} from "../group.service";
import {Group} from "../model/group.model";
import {environment} from "../../../environments/environment";
import {UserService} from "../../user/user.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {JoinCodeInfo} from "../model/join-code-info";

import {ClipboardService} from 'ng2-clipboard/ng2-clipboard';
import {AlertService} from "../../utils/alert-service/alert.service";
import { saveAs } from 'file-saver';
import { MembershipInfo } from '../model/membership.model';

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

  public joinMethodParams: any;
  public addJoinWordForm: FormGroup;

  public isAccountAdmin: boolean = false;
  public welcomeMessageInput: FormControl;
  public welcomeMsgResult: string;

  public activeJoinWords: string[] = [];
  public joinWordCbString: string = "";

  public joinTopics: string[] = [];
  public joinTopicsChanged: boolean = false;

  public justCopied: boolean = false;

  public membership:MembershipInfo;

  public displayName:string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private groupService: GroupService,
              private translateService: TranslateService,
              private alertService: AlertService,
              private clipboardService:ClipboardService) {

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

    this.addJoinWordForm = this.formBuilder.group({
      'joinWord': ['', Validators.compose([Validators.required, Validators.minLength(3),
          this.checkJoinWordAvailability.bind(this)])]
    });

    this.welcomeMessageInput = this.formBuilder.control('');
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

            this.membership = this.group.members.find(member => member.memberUid == this.userService.getLoggedInUser().userUid);

            this.displayName = this.membership == null ? "" : this.membership.displayName;

            const imageBaseUrl = this.baseUrl.replace('/v2', '') + '/image/flyer/group/';
            this.flyerUrlJpg = imageBaseUrl + groupUid + "?typeOfFile=JPEG&color=true&language=en";
            this.flyerUrlPDF = imageBaseUrl + groupUid + "?typeOfFile=PDF&color=true&language=en";
            this.setupJoinParams();
            this.checkWelcomeMessage();
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
    this.setupJoinTopicSelector();
  }

  setupJoinTopicSelector() {
    let selectComponent = $("#join-topic-select");
    selectComponent.select2({
      tags: true
    });

    selectComponent.on('change.select2', function() {
      const data = selectComponent.select2('data');
      this.joinTopics = data.length > 0 ? data.map(tt => tt.id) : [];
      this.joinTopicsChanged = this.joinTopics != this.group.joinTopics;
      console.log("working? :", this.joinTopicsChanged);
    }.bind(this));
  }

  joinMethodsModal() {
    console.log("join method params = ", this.joinMethodParams);
    if (this.group.hasPermission('GROUP_PERMISSION_SEND_BROADCAST') || this.group.joinWords) {
      $('#group-join-methods').modal('show');
      this.groupService.fetchActiveJoinWords().subscribe(result => {
        this.activeJoinWords = result;
      })
    }
  }

  checkJoinWordAvailability(control: FormControl) {
    let word = control.value.toLowerCase();
    if (this.activeJoinWords.includes(word)) {
      return {
        wordTaken: {
          word: word
        }
      }
    }
    return null;
  }

  // on both, we are doing the updates locally instead of fetching whole new entity from server
  // more efficient, but possibly more fragile. watch closely.
  addJoinWord() {
    let word: string = this.addJoinWordForm.get('joinWord').value;
    this.groupService.addGroupJoinWord(this.group.groupUid, word).subscribe(result => {
      this.group.joinWords.push(result);
      this.group.joinWordsLeft--;
      this.addJoinWordForm.get('joinWord').reset('');
      this.setupJoinParams();
    }, error => {
      console.log("something went wrong! : ", error);
    })
  }

  removeJoinWord(joinWord: JoinCodeInfo) {
    console.log("removing join word: ", joinWord);
    this.groupService.removeGroupJoinWord(this.group.groupUid, joinWord.word).subscribe(result => {
      console.log("worked, result: ", result);
      let index = this.group.joinWords.indexOf(joinWord);
      this.group.joinWords.splice(index, 1);
      this.group.joinWordsLeft++;
      this.setupJoinParams();
    }, error => {
      console.log("well that didn't work ... ", error);
    });
    return false;
  }

  copyToCb(joinWord: JoinCodeInfo) {
    let params = {
      'shortCode': this.joinMethodParams.shortCode,
      'groupName': this.group.name,
      'joinWord': joinWord.word,
      'shortUrl': joinWord.shortUrl,
      'ussdCode': this.joinMethodParams.completeJoinCode
    };
    this.translateService.get("group.joinMethods.joinWordCbText", params).subscribe(text => {
      this.joinWordCbString = text;
      this.clipboardService.copy(this.joinWordCbString);
      this.justCopied = true;
      joinWord.copied = true;
      setTimeout(() => joinWord.copied = false, 2000);
    });
    return false;
  }

  setJoinTopics() {
    this.groupService.setJoinTopics(this.group.groupUid, this.joinTopics).subscribe(result => {
      console.log("okay that worked");
      this.alertService.alert("group.joinMethods.joinTopicsUpdated");
      $('#group-join-methods').modal('hide');
      this.groupService.loadGroupDetailsFromServer(this.group.groupUid).subscribe(group => this.group = group);
    }, error => {
      console.log("nope, that didn't work: ", error);
    })
  }

  checkWelcomeMessage() {
    if (this.group.paidFor) {
      this.groupService.fetchGroupWelcomeMessage(this.group.groupUid).subscribe(welcomeMsg => {
        console.log('received welcome msg: ', welcomeMsg);
        this.welcomeMessageInput.reset(welcomeMsg);
      }, error => console.log("error fetching welcome msg: ", error));
    }
  }

  setWelcomeMessage() {
    const message = this.welcomeMessageInput.value;
    this.groupService.setGroupWelcomeMessage(this.group.groupUid, message).subscribe(() => {
      this.welcomeMessageInput.reset(message);
      this.welcomeMsgResult = 'Done! Group welcome message updated';
      setTimeout(() => this.welcomeMsgResult = '', 3000);
    }, error => {
      console.log('error setting group welcome message: ', error);
      this.welcomeMsgResult = 'Sorry, there was an error updating';
      setTimeout(() => this.welcomeMsgResult = '', 3000);
    })
  }

  clearWelcomeMessage() {
    this.groupService.clearGroupWelcomeMessage(this.group.groupUid).subscribe(success => {
      this.welcomeMessageInput.reset('');
      this.welcomeMsgResult = 'Done! Welcome message deactivated';
    }, error => {
      console.log('error clearing group welcome message: ', error);
      this.welcomeMsgResult = 'Sorry, there was an error deactivating';
      setTimeout(() => this.welcomeMsgResult = '', 3000);
    });
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

}
