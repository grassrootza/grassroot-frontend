import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {GroupService} from "../group.service";
import {Group} from "../model/group.model";
import {environment} from "../../../environments/environment";
import {UserService} from "../../user/user.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";
import {TranslateService} from "@ngx-translate/core";
import {JoinCodeInfo} from "../model/join-code-info";

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

  public joinMethodParams: any;
  public addJoinWordForm: FormGroup;

  public activeJoinWords: string[] = [];
  public joinWordCbString: string = "";

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private groupService: GroupService,
              private translateService: TranslateService,
              private spinnerService: Ng4LoadingSpinnerService) {

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
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let groupUid = params['id'];
      this.groupService.loadGroupDetails(groupUid)
        .subscribe(
          groupDetails => {
            this.group = groupDetails;
            this.flyerUrlJpg = this.baseUrl + "/api/group/fetch/flyer?typeOfFile=JPEG&groupUid=" + groupUid + "&color=true&language=en";
            this.flyerUrlPDF = this.baseUrl + "/api/group/fetch/flyer?typeOfFile=PDF&groupUid=" + groupUid + "&color=true&language=en";
            this.setupJoinParams();
          },
          error => {
            if (error.status = 401)
              this.userService.logout();
            console.log("Error loading groups", error.status)
          }
      );
    });
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
    console.log("join method params = ", this.joinMethodParams);
    $('#group-join-methods').modal('show');
    this.groupService.fetchActiveJoinWords().subscribe(result => {
      this.activeJoinWords = result;
    })
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
    this.spinnerService.show();
    this.groupService.addGroupJoinWord(this.group.groupUid, word).subscribe(result => {
      this.spinnerService.hide();
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

  // note: this is a bit of a mess. would have thought copy to clipboard would be much simpler. guess not.
  // most S-O answers not really providing guidance, so need to untangle. string generation works fine though.
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
      console.log("copying: ", this.joinWordCbString);
    });
    return false;
  }

}
