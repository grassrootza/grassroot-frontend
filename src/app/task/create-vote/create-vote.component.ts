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

declare var $: any;

@Component({
  selector: 'app-create-vote',
  templateUrl: './create-vote.component.html',
  styleUrls: ['./create-vote.component.css']
})
export class CreateVoteComponent implements OnInit {

  public createVoteForm: FormGroup;
  public yesNoVote: boolean = true;
  public membersList: Membership[] = [];

  public imageKey: string;
  public imageName: string;

  public confirmingSend: boolean;
  public confirmParams: {};

  @Input() groupUid: string;
  @Output() voteSaved: EventEmitter<boolean>;

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
        this.groupService.fetchGroupMembers(this.groupUid, 0, 100000, []).subscribe(members => {
          this.membersList = members.content;
        });
      }
    }.bind(this));
  }

  initCreateVoteForm(){
    let timeStruct = DateTimeUtils.futureTimeStruct(5);
    console.log("time structure: ", timeStruct);
    this.createVoteForm = this.formBuilder.group({
      'voteType': 'YES_NO',
      'title': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': '',
      'date': [this.dateFromDate(new Date()), Validators.required],
      'time': [timeStruct, Validators.required],
      'parentType': 'GROUP',
      'assignedMemberUids': []
    }, { validator: isDateTimeFuture("date", "time") })
  }

  initVoteOptions() {
    return this.formBuilder.group({
      option: ['', Validators.required]
    });
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
    } else {
      this.createVoteForm.addControl('voteOptions', this.formBuilder.array([
        this.initVoteOptions(),
      ]))
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
    let membersAssigned = this.createVoteForm.get("assignedMemberUids").value && this.createVoteForm.get("assignedMemberUids").value.length > 0;
    let assignedMemberUids = membersAssigned ? this.createVoteForm.get("assignedMemberUids").value : [];
    let assignedMemberNames = membersAssigned ? this.membersList.filter(member => assignedMemberUids.indexOf(member.user.uid) != -1)
        .map(member => member.user.displayName) : this.membersList.map(member => member.user.displayName);

    let nameText = assignedMemberNames.length > 10 ?
      assignedMemberNames.slice(0, 10).join(", ") + " and " + (assignedMemberNames.length - 10) + " others" : assignedMemberNames.join(", ");

    let time = DateTimeUtils.momentFromNgbStruct(this.createVoteForm.get('date').value,
      this.createVoteForm.get('time').value).format('dddd, MMMM Do YYYY, h:mm a');

    this.confirmParams = {
      subject: this.createVoteForm.get("title").value,
      time: time,
      assignedNumber: membersAssigned ? assignedMemberUids.length : this.membersList.length,
      memberNames: nameText
    };

    this.confirmingSend = true;
  }

  createVote() {

    let parentType: string = this.createVoteForm.get("parentType").value;
    let title: string = this.createVoteForm.get("title").value;

    let voteOptions: string[] = [];
    if( this.createVoteForm.get("voteOptions") != null){
      let voteOptionsObjects = this.createVoteForm.get("voteOptions").value;
      if(voteOptionsObjects.length > 0){
        for(let i = 0; i < voteOptionsObjects.length; i++){
          voteOptions.push(voteOptionsObjects[i].option)
        }
      }
    }

    let description: string = this.createVoteForm.get("description").value;

    let voteDate: NgbDateStruct = this.createVoteForm.get('date').value;
    let voteTime: NgbTimeStruct = this.createVoteForm.get('time').value;
    let voteMilis: number = DateTimeUtils.momentFromNgbStruct(voteDate, voteTime).valueOf();

    let assignedMemberUids: string[] = [];
    if(this.createVoteForm.get("assignedMemberUids").value != null){
      for(let i=0; i < this.createVoteForm.get("assignedMemberUids").value.length; i++ ){
        assignedMemberUids.push(this.createVoteForm.get("assignedMemberUids").value[i]);
      }
    }

    this.taskService.createVote(parentType, this.groupUid, title, voteOptions, description, voteMilis, this.imageKey, assignedMemberUids)
      .subscribe(task => {
          console.log("Vote successfully created, groupUid: " + this.groupUid + ", taskUid: " + task.taskUid);
          this.yesNoVote = true;
          this.shouldValidateVoteOptions();
          this.initCreateVoteForm();
          this.confirmingSend = false;
          this.voteSaved.emit(true);
        },
        error => {
          console.log("Error creating task: ", error);
          this.confirmingSend = false;
          this.voteSaved.emit(false);
        })
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
