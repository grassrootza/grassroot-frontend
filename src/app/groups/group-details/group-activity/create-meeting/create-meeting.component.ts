import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbDateTimeStruct} from '@zhaber/ng-bootstrap-datetimepicker';
import {TaskService} from '../../../../task/task.service';
import {ActivatedRoute, Params} from '@angular/router';
import {GroupService} from '../../../group.service';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit {

  private groupUid: string;
  public createMeetingForm: FormGroup;



  constructor( private taskService: TaskService,
               private formBuilder: FormBuilder,
               public activeModal: NgbActiveModal,
               private groupService: GroupService) {
    this.initCreateMeetingForm();
    groupService.groupUid.subscribe(groupUid => {
      this.groupUid = groupUid;
    })
  }

  initCreateMeetingForm(){
    this.createMeetingForm = this.formBuilder.group({
      'subject': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'location': ['', Validators.required],
      'dateTimeEpochMillis': [this.fromDate(new Date()), Validators.required],
      'parentType': 'GROUP',
      'publicMeeting': false,
    });
  }

  ngOnInit() {
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

      this.taskService.createMeeting(parentType, this.groupUid, meetingSubject, meetingLocation, dateTimeEpochMillis, publicMeeting)
        .subscribe(task => {
            console.log("Meeting successfully created, groupUid: " + this.groupUid + ", taskuid:" + task.taskUid);
            this.initCreateMeetingForm();
            this.activeModal.dismiss('Save clicked');

          },
          error => {
            console.log("Error creating task: ", error);
          });
    }
    else {
      console.log("Create meeting form invalid!");
    }
  }

}
