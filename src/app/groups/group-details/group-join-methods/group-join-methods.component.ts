import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { GroupService } from '../../group.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { JoinCodeInfo } from '../../model/join-code-info';
import { TranslateService } from '@ngx-translate/core';
import { GroupMinimal } from '../../model/group.minimal.model';

declare var $: any;

@Component({
  selector: 'app-group-join-methods',
  templateUrl: './group-join-methods.component.html',
  styleUrls: ['./group-join-methods.component.css']
})
export class GroupJoinMethodsComponent implements OnInit, OnChanges {

  @Input() group: GroupMinimal;
  @Input() accountAdmin: boolean;
  @Input() joinMethodParams: any;

  @Output() joinWordAdded: EventEmitter<JoinCodeInfo>;
  @Output() joinWordRemoved: EventEmitter<JoinCodeInfo>;
  @Output() joinTopicsUpdated: EventEmitter<any>;

  public addJoinWordForm: FormGroup;

  public activeJoinWords: string[] = [];
  public joinWordCbString: string = "";

  public joinTopics: string[] = [];
  public joinTopicsChanged: boolean = false;

  public justCopied: boolean = false;

  public welcomeMessageInput: FormControl;
  public welcomeMsgResult: string;

  copyText = 'Should be copied';

  constructor(private groupService: GroupService,
              private translateService: TranslateService,
              private formBuilder: FormBuilder) {
    this.joinWordAdded = new EventEmitter<JoinCodeInfo>();
    this.joinWordRemoved = new EventEmitter<JoinCodeInfo>();
    this.joinTopicsUpdated = new EventEmitter<any>();
  }

  ngOnInit() {
    this.addJoinWordForm = this.formBuilder.group({
      'joinWord': ['', Validators.compose([Validators.required, Validators.minLength(3),
          this.checkJoinWordAvailability.bind(this)])]
    });
    this.welcomeMessageInput = this.formBuilder.control('');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['group'] && this.group) {
      this.setUpParams();
    }
  }

  private setUpParams() {
    this.groupService.fetchActiveJoinWords().subscribe(result => {
      this.activeJoinWords = result;
    });

    setTimeout(() => this.setupJoinTopicSelector(), 100);
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
      this.joinWordAdded.emit(result);
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
      this.joinWordRemoved.emit(joinWord);
    }, error => {
      console.log("well that didn't work ... ", error);
    });
    return false;
  }

  setJoinTopics() {
    this.groupService.setJoinTopics(this.group.groupUid, this.joinTopics).subscribe(result => {
      this.joinTopicsUpdated.emit();
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


}
