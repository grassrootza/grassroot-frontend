import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import { saveAs } from 'file-saver';
import {TaskService} from "../task.service";
import {Task} from "../task.model";
import {convertResponseMap, TaskResponse} from "../task-response";
import {AlertService} from "../../utils/alert-service/alert.service";
import {TaskType} from "../task-type";
import {MediaFunction} from "../../media/media-function.enum";
import {MediaService} from "../../media/media.service";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DateTimeUtils, epochMillisFromDateTime } from '../../utils/DateTimeUtils';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

const RESP_ORDER = {
  'YES': 4, 'NO': 3, 'MAYBE': 2, 'NO_RESPONSE': 1
};

declare var $: any;

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css']
})
export class MeetingDetailsComponent implements OnInit {

  public meetingUid: string = "";
  public meeting: Task;
  public assignedMembers:number;

  public responses: Map<String, String>;
  public responseArray: TaskResponse[];

  public returnToGroup: boolean = false;

  public imageUrl;

  public changeDateTimeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router, private fb: FormBuilder,
              private alertService: AlertService,
              private taskService:TaskService,
              private mediaService: MediaService) {
  }

  ngOnInit() {
    this.alertService.hideLoadingDelayed();
    this.route.params.subscribe((params:Params)=>{
      this.meetingUid = params['id'];
      this.viewMeeting();
      this.fetchResponses();
      this.fetchImage();
    },error=>{
      console.log("Error getting params....",error);
    });

    this.route.queryParams.subscribe((queryParams: Params) => {
      let groupFlag = queryParams['returnToGroup'];
      if (groupFlag)
        this.returnToGroup = true;
    })
  }

  viewMeeting(){
    this.taskService.loadTask(this.meetingUid, "MEETING").subscribe(meeting => {
      this.meeting = meeting;
    },error=>{
      console.log("Error loading meeting......",error);
    })
  }

  fetchResponses() {
    this.taskService.fetchMeetingResponses(this.meetingUid).subscribe(responses => {
      this.responses = responses;
      this.responseArray = convertResponseMap(responses);
      this.responseArray.sort((task1, task2) => {
        if (task1.response == task2.response)
          return task1.memberName > task2.memberName ? 1 : task2.memberName > task1.memberName ? -1 : 0;
        else
          return RESP_ORDER[task1.response] > RESP_ORDER[task2.response] ? -1 : 1;
      })
    })
  }

  fetchImage() {
    this.taskService.fetchImageKey(this.meetingUid, TaskType.MEETING).subscribe(response => {
      if (response) {
        this.imageUrl = this.mediaService.getImageUrl(MediaFunction.TASK_IMAGE, response);
      } else {
        this.imageUrl = '';
      }
    });
  }

  showDateChange() {
    console.log('meeting date: ', DateTimeUtils.dateFromDate(this.meeting.deadlineDate));
    this.changeDateTimeForm = this.fb.group({
      'date': [DateTimeUtils.dateFromDate(this.meeting.deadlineDate), Validators.required],
      'time': [DateTimeUtils.timeFromDate(this.meeting.deadlineDate), Validators.required]
    });
    $('#change-date-modal').modal('show');
  }

  changeMtgDate() {
    let newDate: NgbDateStruct = this.changeDateTimeForm.get('date').value;
    let newTime: NgbTimeStruct = this.changeDateTimeForm.get('time').value;
    
    console.log('changing date to: ', newDate, newTime);

    this.taskService.changeTaskTime(this.meetingUid, TaskType.MEETING, epochMillisFromDateTime(newDate, newTime)).subscribe(changedMtg => {
      this.alertService.alert('task.meeting.change.done', true);
      this.meeting = changedMtg;
      $('#change-date-modal').modal('hide');
    })
  }

  confirmCancel() {
    $("#confirm-cancel-modal").modal('show');
  }

  cancelMeeting() {
    this.taskService.cancelTask(this.meetingUid, TaskType.MEETING, true, !this.returnToGroup).subscribe(response => {
      console.log("done! meeting cancelled, response: ", response);
      $("#confirm-cancel-modal").modal('hide');
      this.alertService.alert('task.meeting.cancel.done', true);
      this.routeToParent();
    })
  }

  routeToParent() {
    if (this.returnToGroup)
      this.router.navigate(['/group', this.meeting.parentUid]);
    else
      this.router.navigate(['/home']);
    return false;
  }


  downloadEventErrorReport() {
    this.taskService.downloadBroadcastErrorReport(this.meeting.type, this.meetingUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      saveAs(blob, "task-error-report.xls");
    }, error => {
      console.log("error getting the file: ", error);
    });
    return false;
  }

}
