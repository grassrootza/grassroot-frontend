import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { Task } from '../task.model';
import { ActivatedRoute, Params } from '@angular/router';
import { TaskType } from '../task-type';
import { ItemPercentage } from 'app/groups/group-details/group-dashboard/member-detail-percent.model';
import { MSG_LANGUAGES, ENGLISH, ZULU } from 'app/utils/language';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(private taskService: TaskService, private route: ActivatedRoute, private fb: FormBuilder) { 
    this.editVoteForm = this.fb.group({});
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params)=>{
      const voteId = params['id'];
      this.taskService.loadTask(voteId, TaskType.VOTE).subscribe(vote => {
        this.vote = vote;
        this.setupResults();
        this.fetchSpecialDetails();
      })
    });
  }

  setupResults() {
    this.totalMembers = this.vote.voteResults['TOTAL_VOTE_MEMBERS'];

    this.options = Object.keys(this.vote.voteResults).filter(key => key != 'TOTAL_VOTE_MEMBERS');
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
      this.setUpLanguagePrompts('opening', details['multiLanguagePrompts']);
      this.promptLanguagesLoaded = true;
      this.setUpLanguagePrompts('post', details['postVotePrompts']);
      this.postVotePromptsLoaded = true;
    }, error => {
      console.log('Error fetching vote special details: ', error);
    })
  }

  setUpLanguagePrompts(prefix, messages) {
    if (!!messages) {
      Object.keys(messages).forEach(lang => {
        // console.log(`Adding control for language: ${lang}, and value: ${messages[lang]}`);
        this.editVoteForm.addControl(prefix + '-' + lang, this.fb.control(messages[lang]));
      });
    }
  }

  saveUpdatedDetails() {
    const openingPrompts = this.extractLanguagePrompts('opening');
    const postVotePompts = this.extractLanguagePrompts('post');
    this.taskService.updateVoteDetails(this.vote.taskUid, openingPrompts, postVotePompts).subscribe(vote => {
      console.log('Updated vote! Altered vote = ', vote);
      this.vote = vote;
    });
  }

  extractLanguagePrompts(prefix: string) {
    let prompts = {};
    this.languages
      .filter(lang => !!this.editVoteForm.get(prefix + '-' + lang.twoDigitCode))
      .filter(lang => !!this.editVoteForm.get(prefix + '-' + lang.twoDigitCode).value)
      .forEach(language => {
        prompts[language.twoDigitCode] = this.editVoteForm.get(prefix + '-' + language.twoDigitCode).value;
      });
    return prompts;
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

}
