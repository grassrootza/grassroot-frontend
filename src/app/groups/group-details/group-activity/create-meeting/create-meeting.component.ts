import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbDateTimeStruct} from '@zhaber/ng-bootstrap-datetimepicker';
import {TaskService} from '../../../../task/task.service';
import {GroupService} from '../../../group.service';
import {Membership} from '../../../model/membership.model';

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
      'dateTimeEpochMillis': [this.fromDate(new Date()), Validators.required],
      'parentType': 'GROUP',
      'publicMeeting': false,
      'assignedMemberUids': []
    });
  }

  ngOnInit() {
    if(this.groupUid != "" && this.groupUid != undefined){
      this.groupService.fetchGroupMembers(this.groupUid, 0, 100000).subscribe(members =>{
        this.membersList = members.content;
      });
    }

  }

  fromDate(date): NgbDateTimeStruct {
    if (date) {
      return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
    } else {
      return date;
    }
  }

  createMeeting(){
    if (this.createMeetingForm.valid) {
      let parentType: string = this.createMeetingForm.get("parentType").value;
      let meetingSubject: string = this.createMeetingForm.get("subject").value;
      let meetingLocation: string = this.createMeetingForm.get("location").value;
      let meetingDateTime:NgbDateTimeStruct = this.createMeetingForm.get("dateTimeEpochMillis").value;
      let dateTimeEpochMillis: number = new Date(meetingDateTime.year,
        meetingDateTime.month-1,
        meetingDateTime.day,
        meetingDateTime.hour,
        meetingDateTime.minute,
        meetingDateTime.second).getTime();
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
