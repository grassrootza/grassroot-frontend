import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../../../../task/task.service';
import {GroupService} from '../../../group.service';
import {Membership} from '../../../model/membership.model';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';

declare var $: any;

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit {

  public createMeetingForm: FormGroup;
  @Input() groupUid: string = "";
  @Output() meetingSaved: EventEmitter<boolean>;
  public membersList: Membership[] = [];

  constructor( private taskService: TaskService,
               private formBuilder: FormBuilder,
               private groupService: GroupService) {
    this.initCreateMeetingForm();
    this.meetingSaved = new EventEmitter<boolean>();
  }

  initCreateMeetingForm(){
    this.createMeetingForm = this.formBuilder.group({
      'subject': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'location': ['', Validators.required],
      'date': [this.dateFromDate(new Date()), Validators.required],
      'time': [this.timeFromDate(new Date()), Validators.required],
      'parentType': 'GROUP',
      'publicMeeting': false,
      'assignedMemberUids': []
    });
  }

  ngOnInit() {

    $('#create-meeting-modal').on('shown.bs.modal', function () {
      console.log("Create meeting dialog shown for group: " + this.groupUid);
      if (this.groupUid != "" && this.groupUid != undefined) {
        this.groupService.fetchGroupMembers(this.groupUid, 0, 100000).subscribe(members => {
          this.membersList = members.content;
        });
      }
    }.bind(this))
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

  createMeeting(){
    if (this.createMeetingForm.valid) {
      let parentType: string = this.createMeetingForm.get("parentType").value;
      let meetingSubject: string = this.createMeetingForm.get("subject").value;
      let meetingLocation: string = this.createMeetingForm.get("location").value;

      let voteDate: NgbDateStruct = this.createMeetingForm.get('date').value;
      let voteTime: NgbTimeStruct = this.createMeetingForm.get('time').value;
      let dateTimeEpochMillis: number = new Date(voteDate.year,
        voteDate.month-1,
        voteDate.day,
        voteTime.hour,
        voteTime.minute,
        voteTime.second).getTime();

      let publicMeeting: boolean = this.createMeetingForm.get("publicMeeting").value;

      let assignedMemberUids: string[] = [];
      if( this.createMeetingForm.get("assignedMemberUids").value != null){
        for(let i=0; i < this.createMeetingForm.get("assignedMemberUids").value.length; i++ ){
          assignedMemberUids.push(this.createMeetingForm.get("assignedMemberUids").value[i]);
        }
      }

      this.taskService.createMeeting(parentType, this.groupUid, meetingSubject, meetingLocation, dateTimeEpochMillis, publicMeeting, assignedMemberUids)
        .subscribe(task => {
            console.log("Meeting successfully created, groupUid: " + this.groupUid + ", taskuid:" + task.taskUid);
            this.initCreateMeetingForm();
            this.meetingSaved.emit(true)
          },
          error => {
            console.log("Error creating task: ", error);
            this.meetingSaved.emit(false);
          });
    }
    else {
      console.log("Create meeting form invalid!");
    }
  }

}
