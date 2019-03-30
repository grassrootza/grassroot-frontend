import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskService} from '../task.service';
import {GroupService} from '../../groups/group.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {Membership} from '../../groups/model/membership.model';
import {MediaFunction} from "../../media/media-function.enum";
import {AlertService} from "../../utils/alert-service/alert.service";
import {MediaService} from "../../media/media.service";
import {DateTimeUtils, isDateTimeFuture} from "../../utils/DateTimeUtils";
import { TaskPreview } from '../task-preview.model';
import { TaskType } from '../task-type';
import { environment } from 'environments/environment';
import { Language, MSG_LANGUAGES } from 'app/utils/language';

declare var $: any;

@Component({
  selector: 'app-create-vote',
  templateUrl: './create-vote.component.html',
  styleUrls: ['./create-vote.component.css']
})
export class CreateVoteComponent implements OnInit {

  @Input() groupUid: string;
  @Input() preAssignedMemberUids: string[] = [];
  @Input() preAssignedMemberNames: string[] = [];

  @Output() voteSaved: EventEmitter<boolean>;

  public createVoteForm: FormGroup;
  public yesNoVote: boolean = true;

  public membersList: Membership[] = [];
  public memberCount: number;
  public showMemberAssignment: boolean = false;
  private assignedMemberUids: string[] = [];

  public imageKey: string;
  public imageName: string;

  public confirmingSend: boolean;
  public confirmParams: {};
  public taskPreview: TaskPreview;

  public isGroupPaidFor = false;
  public canRandomize = false;
  public isMassVote = false;

  public languages = MSG_LANGUAGES;

  constructor(private taskService: TaskService,
              private formBuilder: FormBuilder,
              private groupService: GroupService,
              private mediaService: MediaService,
              private alertService: AlertService) {
    this.initCreateVoteForm();
    this.voteSaved = new EventEmitter<boolean>();
  }

  ngOnInit() {
    $('#create-vote-modal').on('shown.bs.modal', function () {
      if (this.groupUid != "" && this.groupUid != undefined) {
        this.groupService.loadGroupDetailsCached(this.groupUid, false).subscribe(resp => {
          console.log('response: ', resp);
          this.isGroupPaidFor = resp.paidFor;
          this.memberCount = resp.memberCount;
          this.setUpMemberPicker();
        });    
      }
    }.bind(this));
  }

  initCreateVoteForm() {
    let timeStruct = DateTimeUtils.futureTimeStruct(5);
    this.createVoteForm = this.formBuilder.group({
      'voteType': 'YES_NO',
      'title': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': '',
      'date': [this.dateFromDate(new Date()), Validators.required],
      'time': [timeStruct, Validators.required],
      'specialForm': ['ORDINARY'],
      'parentType': 'GROUP',
      'assignedMemberUids': [],
      'randomize': [''],
      'excludeAbstain': false,
      'excludeNotifications': false
    }, { validator: isDateTimeFuture("date", "time") });

    this.createVoteForm.controls['specialForm'].valueChanges.subscribe(value => {
      this.isMassVote = value == 'MASS_VOTE';
      if (this.isMassVote) this.initMassVoteOptions();
    })

  }

  initVoteOptions() {
    return this.formBuilder.group({
      option: ['', Validators.required]
    });
  }

  setUpMemberPicker() {
    if (this.memberCount < environment.memberFetchCutOff) {
      console.log('member count low enough, showing assigned members');
      this.fetchAssignedMembers();
    } else {
      console.log(`${this.memberCount} greater than ${environment.memberFetchCutOff} so not showing member assign`);
      this.showMemberAssignment = false;
    }
  }

  fetchAssignedMembers() {
    this.groupService.fetchGroupMembers(this.groupUid, 0, 100000, []).subscribe(members => {
      this.membersList = members.content;
      this.showMemberAssignment = true;
      // console.log('member list: ', this.membersList);
      this.setAssignedMembers();
    });
  }

  setAssignedMembers() {
    if (this.preAssignedMemberUids) {
      this.createVoteForm.get('assignedMemberUids').setValue(this.preAssignedMemberUids, { onlySelf: true })
    }
  }

  toggleAssignedMembers() {
    if (this.showMemberAssignment) {
      this.showMemberAssignment = false;
    } else {
      this.fetchAssignedMembers();
    }
    return false;
  }

  // todo : focus on new input (but non-trivial - https://github.com/angular/angular/issues/13158)
  addOption() {
    const control = < FormArray > this.createVoteForm.controls['voteOptions'];
    control.push(this.initVoteOptions());
  }

  removeOption(i: number) {
    const control = < FormArray > this.createVoteForm.controls['voteOptions'];
    control.removeAt(i);
  }

  dateFromDate(date): NgbDateStruct{
    if(date){
      return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    }else{
      return date;
    }
  }

  timeFromDate(date): NgbTimeStruct{
    if(date){
      return {hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
    }else{
      return date;
    }
  }

  voteTypeChanged(voteType) {
    this.yesNoVote = voteType === 'YES_NO';
    this.shouldValidateVoteOptions();
    if(this.yesNoVote){
      this.createVoteForm.removeControl('voteOptions');
      this.canRandomize = false;
    } else {
      this.createVoteForm.addControl('voteOptions', this.formBuilder.array([
        this.initVoteOptions(),
      ]));
      this.canRandomize = this.isGroupPaidFor;
    }
  }

  shouldValidateVoteOptions(){
    if(this.yesNoVote){
      this.createVoteForm.removeControl('voteOptions');
      this.createVoteForm.addControl('voteOptions', this.formBuilder.array([]))
    }else{
      this.createVoteForm.addControl('voteOptions', this.formBuilder.array([
        this.initVoteOptions(),
      ]))
    }
  }

  initMassVoteOptions() {
    if (!this.createVoteForm.get('opening-eng')) {
      console.log('No language prompt controls present, adding them');
      this.initLanguagePrompts('opening-');
    }

    if (!this.createVoteForm.get('post-eng')) {
      console.log('No post-vote prompt controls present, adding them');
      this.initLanguagePrompts('post-');
    }

    if (!this.createVoteForm.get('langoptions-en')) {
      console.log('No multi-language options controls present, adding them');
      this.initLanguagePrompts('langoptions-');
    }

    // console.log('English control : ', this.createVoteForm.get('prompt-eng'));
  }

  initLanguagePrompts(prefix: string) {
    this.languages.forEach(language => {
      this.createVoteForm.addControl(prefix + language.threeDigitCode, this.formBuilder.control(''));
    });
  }

  extractLanguagePrompts(prefix: string) {
    let prompts = {};
    this.languages
      .filter(lang => !!this.createVoteForm.get(prefix + lang.threeDigitCode) && !!this.createVoteForm.get(prefix + lang.threeDigitCode).value)
      .forEach(language => {
        prompts[language.twoDigitCode] = this.createVoteForm.get(prefix + language.threeDigitCode).value;
      });
    return prompts;
  }

  extractMultiLanguageOptions() {
    let optionsMap = {};
    const rawTexts = this.extractLanguagePrompts('langoptions-');
    Object.keys(rawTexts).forEach(lang => {
      const splitList = rawTexts[lang].split(/\r?\n/);
      console.log('Split list: ', splitList);
      optionsMap[lang] = splitList;
    });
    console.log('Assembled options map: ', optionsMap);
    return optionsMap;
  }

  next() {
    if (this.createVoteForm.valid) {
      if (this.confirmingSend) {
        this.createVote();
      } else {
        this.confirmVote();
      }
    }
  }

  confirmVote() {
    const membersSelected = this.createVoteForm.get("assignedMemberUids").value && this.createVoteForm.get("assignedMemberUids").value.length > 0;
    const membersAssigned = membersSelected || this.preAssignedMemberUids.length > 0; // since may not show box but may have prior assigned
    
    this.assignedMemberUids = [];
    let assignedMemberNames = [];
    
    if (this.memberCount > environment.memberFetchCutOff) {
      // means members selected via a bulk manage etc but not selected here, so, retain
      this.assignedMemberUids = this.preAssignedMemberUids;
      assignedMemberNames = this.preAssignedMemberNames;
    } else if (membersSelected) {
      this.assignedMemberUids = this.createVoteForm.get("assignedMemberUids").value;
      assignedMemberNames = this.membersList.filter(member => this.assignedMemberUids.indexOf(member.userUid) != -1)
        .map(member => member.displayName);
    } else {
      assignedMemberNames = this.membersList.map(member => member.displayName)
    }

    let nameText = !membersAssigned ? ' the whole group' : assignedMemberNames.length > 10 ?
      assignedMemberNames.slice(0, 10).join(", ") + " and " + (assignedMemberNames.length - 10) + " others" : assignedMemberNames.join(", ");

    let time = DateTimeUtils.momentFromNgbStruct(this.createVoteForm.get('date').value,
      this.createVoteForm.get('time').value).format('dddd, MMMM Do YYYY, h:mm a');

    this.confirmParams = {
      subject: this.createVoteForm.get("title").value,
      time: time,
      membersAssigned: membersAssigned,
      assignedNumber: membersAssigned ? this.assignedMemberUids.length : this.memberCount,
      memberNames: nameText
    };

    this.confirmingSend = true;

    let specialForm = this.isGroupPaidFor ? this.createVoteForm.get('specialForm').value : 'ORDINARY';
    
    let voteOptions: string[] = [];
    if( this.createVoteForm.get("voteOptions") != null){
      let voteOptionsObjects = this.createVoteForm.get("voteOptions").value;
      if(voteOptionsObjects.length > 0){
        for(let i = 0; i < voteOptionsObjects.length; i++){
          voteOptions.push(voteOptionsObjects[i].option)
        }
      }
    }
    
    let voteMilis: number = this.extractVoteDeadlineMillis();
    this.taskService.loadPreviewEvent(TaskType.VOTE, this.groupUid, this.confirmParams['subject'], voteMilis, this.createVoteForm.get("description").value,
      specialForm, this.imageKey, null, voteOptions).subscribe(taskPreview => {
        this.taskPreview = taskPreview;
        // console.log('got a preview! : ', this.taskPreview);
      }, error => {
        console.log('error generating preview! : ', error);
      })
  }

  createVote() {

    let params = {};

    params['title'] = this.createVoteForm.get("title").value;
    params['time'] =  DateTimeUtils.momentFromNgbStruct(this.createVoteForm.get('date').value, 
      this.createVoteForm.get('time').value).valueOf();


    let voteOptions: string[] = [];
    let randomize = false;
    
    if (this.createVoteForm.get("voteOptions") != null) {
      let voteOptionsObjects = this.createVoteForm.get("voteOptions").value;
      if(voteOptionsObjects.length > 0){
        for(let i = 0; i < voteOptionsObjects.length; i++){
          voteOptions.push(voteOptionsObjects[i].option)
        }
      }
      params['voteOptions'] = voteOptions;
      params['randomizeOptions'] = this.createVoteForm.get('randomize').value;
    }

    console.log('randomize: ', randomize);

    params['description'] = this.createVoteForm.get("description").value;
    params['voteMilis'] = this.extractVoteDeadlineMillis();

    params['specialForm'] = this.isGroupPaidFor ? this.createVoteForm.get('specialForm').value : 'ORDINARY';
    
    if (this.isMassVote) {
      console.log('Mass vote, setting boolean flags');
      params['sendNotifications'] = !this.createVoteForm.get('excludeNotifications').value;
      params['excludeAbstain'] = this.createVoteForm.get('excludeAbstain').value;
      params['multiLanguagePrompts'] = this.extractLanguagePrompts('opening-');
      params['postVotePrompts'] = this.extractLanguagePrompts('post-');
      params['multiLanguageOptions'] = this.extractMultiLanguageOptions();
      console.log('Setting params as: ', params);
    }

    this.taskService.createVoteNew(this.groupUid, params).subscribe(task => {
          console.log("Vote successfully created, groupUid: " + this.groupUid + ", taskUid: " + task.taskUid);
          this.yesNoVote = true;
          this.shouldValidateVoteOptions();
          this.initCreateVoteForm();
          this.confirmingSend = false;
          this.voteSaved.emit(true);
          console.log("Completed internally after vote creation");
        },
        error => {
          console.log("Error creating task: ", error);
          this.confirmingSend = false;
          this.voteSaved.emit(false);
        })
  }

  extractVoteDeadlineMillis(): number {
    let voteDate: NgbDateStruct = this.createVoteForm.get('date').value;
    let voteTime: NgbTimeStruct = this.createVoteForm.get('time').value;
    return DateTimeUtils.momentFromNgbStruct(voteDate, voteTime).valueOf();
  }

  addVoteImage(event){
    let images = event.target.files;
    if(images.length > 0){
      let image = images[0];
      this.alertService.showLoading();
      this.mediaService.uploadMedia(image, MediaFunction.TASK_IMAGE).subscribe(resp =>{
        this.imageKey = resp;
        this.imageName = image.name;
        this.alertService.hideLoading();
        console.log("Image Key...........",this.imageKey);
      },error =>{
        this.alertService.hideLoading();
        console.log("Error loading image");
      })
    }
  }

  clearImage() {
    this.imageKey = undefined;
    this.imageName = undefined;
    return false;
  }


}
