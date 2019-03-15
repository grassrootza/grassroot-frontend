import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskType } from '../task-type';
import { ItemPercentage } from 'app/groups/group-details/group-dashboard/member-detail-percent.model';
import { MSG_LANGUAGES, ENGLISH, ZULU } from 'app/utils/language';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DateTimeUtils, epochMillisFromDate, epochMillisFromDateTime } from 'app/utils/DateTimeUtils';

@Component({
  selector: 'app-edit-vote',
  templateUrl: './edit-vote.component.html',
  styleUrls: ['./edit-vote.component.css']
})
export class EditVoteComponent implements OnInit {

  public vote: Task;
  public totalMembers: number;
  public options: string[];
  public results: ItemPercentage[] = [];

  public extraDetails = {};
  public massVote = false;
  public languages = MSG_LANGUAGES;

  public editVoteForm: FormGroup;
  public promptLanguagesLoaded = false;
  public postVotePromptsLoaded = false;
  public multiLanguageOptionsLoaded = false;

  public changingDate = false;

  constructor(private taskService: TaskService, private route: ActivatedRoute, private fb: FormBuilder) { 
    this.editVoteForm = this.fb.group({
      'date': [DateTimeUtils.nowAsDateStruct()], 
      'time': [DateTimeUtils.timeFromDate(new Date())],
      'primary-options': [''],
      'randomize': [false],
      'preClosed': [false]
    });
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params)=>{
      const voteId = params['id'];
      this.taskService.loadTask(voteId, TaskType.VOTE).subscribe(vote => {
        // console.log('Received vote: ', vote);
        this.vote = vote;
        this.setUpClosingDateTime();
        this.setupResults();
        this.fetchSpecialDetails();
      })
    });
  }

  setUpClosingDateTime() {
    this.editVoteForm.get('date').setValue(DateTimeUtils.dateFromDate(this.vote.deadlineDate));
    this.editVoteForm.get('date').disable();
    // console.log('After setting, control value: ', this.editVoteForm.get('date'));
    this.editVoteForm.get('time').setValue(DateTimeUtils.timeFromDate(this.vote.deadlineDate));
    this.editVoteForm.get('time').disable();
    this.changingDate = false;
  }

  setupResults() {
    this.totalMembers = this.vote.voteResults['TOTAL_VOTE_MEMBERS'];

    this.options = Object.keys(this.vote.voteResults).filter(key => key != 'TOTAL_VOTE_MEMBERS');
    this.editVoteForm.get('primary-options').setValue(this.options.join('\n'));

    let totalVotes = this.options.map(key => this.vote.voteResults[key]).reduce((total, num) => total + num);

    this.results = this.options.map(option => new ItemPercentage(option,
      totalVotes > 0 ? Math.round((this.vote.voteResults[option] / totalVotes) * 100) : 0,
      this.vote.voteResults[option]));
  }

  fetchSpecialDetails() {
    this.taskService.fetchVoteSpecialDetails(this.vote.taskUid).subscribe(details => {
      console.log('Fetched special vote details: ', details);
      this.extraDetails = details;
      this.massVote = details['specialForm'] == 'MASS_VOTE';
      this.editVoteForm.get('randomize').setValue(details['randomizeOptions']);
      this.editVoteForm.get('preClosed').setValue(details['preClosed']);

      this.setUpLanguagePrompts('opening', details['multiLanguagePrompts']);
      this.promptLanguagesLoaded = true;
      this.setUpLanguagePrompts('post', details['postVotePrompts']);
      this.postVotePromptsLoaded = true;
      this.setUpLanguageOptions(details['multiLanguageOptions']);
      this.multiLanguageOptionsLoaded = true;
    }, error => {
      console.log('Error fetching vote special details: ', error);
    })
  }

  setUpLanguagePrompts(prefix: string, messages: { [x: string]: any; }) {
    this.languages.forEach(lang => {
      const controlName = prefix + '-' + lang.twoDigitCode;
      const controlContent = !!messages && !!messages[lang.twoDigitCode] ? messages[lang.twoDigitCode] : '';
      this.editVoteForm.addControl(controlName, this.fb.control(controlContent));
    });
  }

  setUpLanguageOptions(multiLingualOptions: { [x: string]: { join: (arg0: string) => void; }; }) {
    const optionsToShow = !!multiLingualOptions ? multiLingualOptions : { };
    this.languages.forEach(lang => {
      const optionsList = !!optionsToShow[lang.twoDigitCode] ? optionsToShow[lang.twoDigitCode].join('\n') : '';
      this.editVoteForm.addControl('options-' + lang.twoDigitCode, this.fb.control(optionsList));
    })
  }

  toggleChangingDate() {
    this.changingDate = true;
    this.editVoteForm.get('date').enable();
    this.editVoteForm.get('time').enable();
    return false;
  }

  saveUpdatedDetails() {
    let updateRequest = {};

    const openingPromptsChanged = this.checkIfLanguageStuffChanged('opening');
    const postPromptsChanged = this.checkIfLanguageStuffChanged('post');

    const optionsChanged = this.editVoteForm.get('primary-options').dirty;
    const multiLangOptionsChanged = this.checkIfLanguageStuffChanged('options');

    const randomizeChanged = this.editVoteForm.get('randomize').dirty;
    const preClosedChanged = this.editVoteForm.get('preClosed').dirty;

    console.log(`What changed? primary options: ${optionsChanged}, multiLangOptions: ${multiLangOptionsChanged}, 
      openingPrompts: ${openingPromptsChanged}, postPrompts: ${postPromptsChanged}`);

    if (this.changingDate)
      updateRequest['voteClosingDateMillis'] = epochMillisFromDateTime(this.editVoteForm.get('date').value, this.editVoteForm.get('time').value);

    if (optionsChanged)
      updateRequest['voteOptions'] = this.editVoteForm.get('primary-options').value.split('\n');

    if (multiLangOptionsChanged)
      updateRequest['multiLingualOptions'] = this.extractLanguageOptions();
    
    if (openingPromptsChanged)
      updateRequest['multiLanguagePrompts'] = this.extractLanguagePrompts('opening');

    if (postPromptsChanged)
      updateRequest['postVotePrompts'] = this.extractLanguagePrompts('post');

    if (randomizeChanged)
      updateRequest['randomizeOptions'] = this.editVoteForm.get('randomize').value;

    if (preClosedChanged)
      updateRequest['preCloseVote'] = this.editVoteForm.get('preClosed').value;

    console.log('Corresponding update request: ', updateRequest);

    this.taskService.updateVoteDetails(this.vote.taskUid, updateRequest).subscribe(vote => {
      console.log('Updated vote! Altered vote = ', vote);
      this.vote = vote;
    });
  }

  checkIfLanguageStuffChanged(prefix: string) {
    return this.languages
      .some(lang => this.controlAltered(prefix, lang));
  }

  extractLanguagePrompts(prefix: string) {
    let prompts = {};
    this.languages
      .filter(lang => this.controlNonEmpty(prefix, lang))
      .forEach(language => {
        prompts[language.twoDigitCode] = this.editVoteForm.get(prefix + '-' + language.twoDigitCode).value;
      });
    return prompts;
  }

  extractLanguageOptions() {
    let options = {};
    this.languages.filter(lang => this.controlNonEmpty('options', lang))
      .forEach(lang => options[lang.twoDigitCode] = this.editVoteForm.get('options-' + lang.twoDigitCode).value.split('\n'));
    return options;
  }

  clearPostVotePrompts() {
    this.taskService.clearPostVotePrompts(this.vote.taskUid).subscribe(details => {
      console.log('Revised details: ', details);
      this.languages.filter(lang => !!this.editVoteForm.get('post-' + lang.twoDigitCode) 
        && !!this.editVoteForm.get('post-' + lang.twoDigitCode))
        .forEach(lang => this.editVoteForm.get('post-' + lang.twoDigitCode).setValue(''));
    });
  }

  closeVote() {
    this.taskService.changeTaskTime(this.vote.taskUid, TaskType.VOTE, (new Date).getTime()).subscribe(data => {
      this.vote = data;
    })
  }

  controlNonEmpty(prefix, lang) {
    return !!this.editVoteForm.get(prefix + '-' + lang.twoDigitCode) && !!this.editVoteForm.get(prefix + '-' + lang.twoDigitCode).value;
  }

  controlAltered(prefix, lang) {
    return !!this.editVoteForm.get(prefix + '-' + lang.twoDigitCode)
      && this.editVoteForm.get(prefix + '-' + lang.twoDigitCode).dirty;
  }

}
