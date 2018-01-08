import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from "@angular/router";
import {GroupService} from "../group.service";
import {Group} from "../model/group.model";
import {environment} from "../../../environments/environment";
import {UserService} from "../../user/user.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

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

  public joinMethodParams: any;
  public addJoinWordForm: FormGroup;

  public activeJoinWords: string[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private groupService: GroupService) {

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
      joinWords: this.group.joinWords.join(', '),
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
    console.log("validating word: ");
    if (this.activeJoinWords.includes(word)) {
      console.log("no! words coincide");
      return {
        wordTaken: {
          word: word
        }
      }
    }
    return null;
  }

  addJoinWord() {
    let word: string = this.addJoinWordForm.get('joinWord').value;
    this.groupService.addGroupJoinWord(this.group.groupUid, word).subscribe(result => {
      console.log("worked! result: ", result);
      this.group.joinWords.push(word);
    }, error => {
      console.log("something went wrong! : ", error);
    })
  }

  removeJoinWord(word: string) {
    this.groupService.removeGroupJoinWord(this.group.groupUid, word).subscribe(result => {
      console.log("worked, result: ", result);
      let index = this.group.joinWords.indexOf(word);
      this.group.joinWords.splice(index, 1);
      this.group.joinWordsLeft++;
    }, error => {
      console.log("well that didn't work ... ", error);
    });
    return false;
  }

}
