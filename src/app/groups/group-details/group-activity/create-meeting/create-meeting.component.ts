import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../../../../task/task.service';
import {GroupService} from '../../../group.service';
import {Membership} from '../../../model/membership.model';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {DateTimeUtils} from "../../../../utils/DateTimeUtils";

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

  public confirmingSend: boolean = false;
  public confirmParams;

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
      'date': [DateTimeUtils.dateFromDate(new Date()), Validators.required],
      'time': [DateTimeUtils.timeFromDate(new Date()), Validators.required],
      'parentType': 'GROUP',
      'publicMeeting': false,
      'assignedMemberUids': []
    });
  }

  ngOnInit() {

    $('#create-meeting-modal').on('shown.bs.modal', function () {
      console.log("Create meeting dialog shown for group: " + this.groupUid);
      if (this.groupUid != "" && this.groupUid != undefined) {
        this.groupService.fetchGroupMembers(this.groupUid, 0, 100000, []).subscribe(members => {
          this.membersList = members.content;
        });
      }
    }.bind(this))
  }

  next() {
    if (this.createMeetingForm.valid) {
      if (this.confirmingSend || this.createMeetingForm.get("assignedMemberUids").value == null) {
        this.createMeeting();
      } else {
        this.confirmMeeting();
      }
    }
  }

  confirmMeeting() {
    let assignedMemberUids = this.createMeetingForm.get("assignedMemberUids").value;
    let assignedMemberNames = this.membersList.filter(member => assignedMemberUids.indexOf(member.user.uid) != -1)
      .map(member => member.user.displayName);

    let time = DateTimeUtils.momentFromNgbStruct(this.createMeetingForm.get('date').value,
      this.createMeetingForm.get('time').value).format('dddd, MMMM Do YYYY, h:mm a');

    this.confirmParams = {
      subject: this.createMeetingForm.get("subject").value,
      location: this.createMeetingForm.get("location").value,
      time: time,
      assignedNumber: assignedMemberUids.length,
      memberNames: assignedMemberNames.join(', ')
    };

    this.confirmingSend = true;
  }

  cancel() {
    // else creates a weird jitter effect as modal isn't closed yet
    setTimeout(() => this.confirmingSend = false, 500);
  }

  createMeeting(){

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
        }, error => {
          console.log("Error creating task: ", error);
          this.meetingSaved.emit(false);
      });
  }

}
