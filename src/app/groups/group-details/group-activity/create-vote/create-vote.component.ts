import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TaskService} from '../../../../task/task.service';
import {GroupService} from '../../../group.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbDateTimeStruct} from '@zhaber/ng-bootstrap-datetimepicker';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Membership} from '../../../model/membership.model';

@Component({
  selector: 'app-create-vote',
  templateUrl: './create-vote.component.html',
  styleUrls: ['./create-vote.component.css']
})
export class CreateVoteComponent implements OnInit {

  public createVoteForm: FormGroup;
  public yesNoVote: boolean = true;
  public membersList: Membership[] = [];

  @Input() groupUid: string;
  @Output() voteSaved: EventEmitter<boolean>;


  constructor(private taskService: TaskService,
              private formBuilder: FormBuilder,
              private groupService: GroupService) {
    this.initCreateVoteForm();
    this.voteSaved = new EventEmitter<boolean>();
  }

  ngOnInit() {
    this.groupService.fetchGroupMembers(this.groupUid, 0, 100000).subscribe(members =>{
      this.membersList = members.content;
    });
  }

  initCreateVoteForm(){

    this.createVoteForm = this.formBuilder.group({
      'voteType': 'YES_NO',
      'title': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': '',
      'time': [this.fromDate(new Date()), Validators.required],
      'parentType': 'GROUP',
      'assignedMemberUids': []
    })
  }

  initVoteOptions() {
    return this.formBuilder.group({
      option: ['', Validators.required]
    });
  }
  addOption() {
    const control = < FormArray > this.createVoteForm.controls['voteOptions'];
    control.push(this.initVoteOptions());
  }
  removeOption(i: number) {
    const control = < FormArray > this.createVoteForm.controls['voteOptions'];
    control.removeAt(i);
  }

  fromDate(date): NgbDateTimeStruct {
    if (date) {
      return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
    } else {
      return date;
    }
  }

  voteTypeChanged(voteType) {
    this.yesNoVote = voteType === 'YES_NO';
    this.shouldValidateVoteOptions();
    if(this.yesNoVote){
      this.createVoteForm.removeControl('voteOptions');

    }else{
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

  createVote(){
    if(this.createVoteForm.valid){
      console.log("vote create");
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
      let voteTime:NgbDateTimeStruct = this.createVoteForm.get("time").value;
      let voteMilis: number = new Date(voteTime.year,
        voteTime.month-1,
        voteTime.day,
        voteTime.hour,
        voteTime.minute,
        voteTime.second).getTime();

      let assignedMemberUids: string[] = [];
      if(this.createVoteForm.get("assignedMemberUids").value != null){
        for(let i=0; i < this.createVoteForm.get("assignedMemberUids").value.length; i++ ){
          assignedMemberUids.push(this.createVoteForm.get("assignedMemberUids").value[i]);
        }
      }


      this.taskService.createVote(parentType, this.groupUid, title, voteOptions, description, voteMilis, assignedMemberUids)
        .subscribe(task => {
            console.log("Vote successfully created, groupUid: " + this.groupUid + ", taskUid: " + task.taskUid);
            this.yesNoVote = true;
            this.shouldValidateVoteOptions();
            this.initCreateVoteForm();
            this.voteSaved.emit(true);
          },
          error => {
            console.log("Error creating task: ", error);
            this.voteSaved.emit(false);
          })
    }else{
      console.log("Create vote form invalid!");
    }
  }



}