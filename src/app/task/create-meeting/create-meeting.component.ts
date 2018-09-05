import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../task.service';
import {Membership} from '../../groups/model/membership.model';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {DateTimeUtils, isDateTimeFuture} from "../../utils/DateTimeUtils";
import {MediaService} from "../../media/media.service";
import {MediaFunction} from "../../media/media-function.enum";
import {AlertService} from "../../utils/alert-service/alert.service";
import { TaskPreview } from '../task-preview.model';
import { TaskType } from '../task-type';
import { GroupService } from '../../groups/group.service';
import { environment } from 'environments/environment.prod';

declare var $: any;

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.css']
})
export class CreateMeetingComponent implements OnInit {

  public createMeetingForm: FormGroup;

  @Input() groupUid: string = "";
  @Input() preAssignedMemberUids: string[] = [];
  @Input() preAssignedMemberNames: string[] = [];

  @Output() meetingSaved: EventEmitter<boolean>;
  
  public memberCount: number;
  public showMemberAssignment: boolean = false;
  public membersList: Membership[] = [];
  private assignedMemberUids: string[] = [];

  public confirmingSend: boolean = false;
  public confirmParams;
  public taskPreview: TaskPreview;

  public imageName;
  public imageKey;

  public isGroupPaidFor:boolean;

  public meetingImportance:string = 'ORDINARY';

  constructor( private taskService: TaskService,
               private formBuilder: FormBuilder,
               private mediaService: MediaService,
               private groupService: GroupService,
               private alertService: AlertService) {
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
      'description': [''],
      'assignedMemberUids': []
    }, { validator: isDateTimeFuture("date", "time") });
  }

  ngOnInit() {
    $('#create-meeting-modal').on('shown.bs.modal', function () {
      console.log('Create meeting dialog shown for group: ', this.groupUid);
      if (this.groupUid != "" && this.groupUid != undefined) {
        // since it will be down by definition (if in this modal)
        this.groupService.loadGroupDetailsCached(this.groupUid, false).subscribe(resp => {
          this.isGroupPaidFor = resp.paidFor;
          this.memberCount = resp.memberCount;
          this.setUpMemberPicker();
        });
      }
    }.bind(this))
  }

  setUpMemberPicker() {
    if (this.memberCount < environment.memberFetchCutOff) {
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
      console.log('member list: ', this.membersList);
      this.setAssignedMembers();
    });
  }

  setAssignedMembers() {
    if (this.preAssignedMemberUids) {
      this.createMeetingForm.get('assignedMemberUids').setValue(this.preAssignedMemberUids, { onlySelf: true })
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

  next() {
    if (this.createMeetingForm.valid) {
      if (this.confirmingSend) {
        this.createMeeting();
      } else {
        this.confirmMeeting();
      }
    }
  }

  confirmMeeting() {
    const membersSelected = this.createMeetingForm.get("assignedMemberUids").value && this.createMeetingForm.get("assignedMemberUids").value.length > 0;
    const membersAssigned = membersSelected || this.preAssignedMemberUids.length > 0; // since may not show box but may have prior assigned
    
    this.assignedMemberUids = [];
    let assignedMemberNames = [];
    
    if (this.memberCount > environment.memberFetchCutOff) {
      // means members selected via a bulk manage etc but not selected here, so, retain
      this.assignedMemberUids = this.preAssignedMemberUids;
      assignedMemberNames = this.preAssignedMemberNames;
    } else if (membersSelected) {
      this.assignedMemberUids = this.createMeetingForm.get("assignedMemberUids").value;
      assignedMemberNames = this.membersList.filter(member => this.assignedMemberUids.indexOf(member.userUid) != -1)
        .map(member => member.displayName);
    } else {
      assignedMemberNames = this.membersList.map(member => member.displayName)
    }

    let nameText = !membersAssigned ? ' the whole group' : assignedMemberNames.length > 10 ?
      assignedMemberNames.slice(0, 10).join(", ") + " and " + (assignedMemberNames.length - 10) + " others" : assignedMemberNames.join(", ");

    let time = DateTimeUtils.momentFromNgbStruct(this.createMeetingForm.get('date').value,
      this.createMeetingForm.get('time').value).format('dddd, MMMM Do YYYY, h:mm a');

    this.confirmParams = {
      subject: this.createMeetingForm.get("subject").value,
      location: this.createMeetingForm.get("location").value,
      time: time,
      membersAssigned: membersAssigned,
      assignedNumber: membersAssigned ? this.assignedMemberUids.length : this.memberCount,
      memberNames: nameText
    };

    this.confirmingSend = true;

    this.taskService.loadPreviewEvent(TaskType.MEETING, this.groupUid, this.confirmParams.subject, this.extractMeetingTimeMillis(), this.createMeetingForm.get('description').value,
        this.meetingImportance, this.imageKey, this.confirmParams['location']).subscribe(preview => {
          this.taskPreview = preview;
        }, error => {
          console.log('error getting meeting preview: ', error);
        });
  }

  cancel() {
    // else creates a weird jitter effect as modal isn't closed yet
    setTimeout(() => this.confirmingSend = false, 500);
  }

  createMeeting(){

    let parentType: string = this.createMeetingForm.get("parentType").value;
    let meetingSubject: string = this.createMeetingForm.get("subject").value;
    let meetingLocation: string = this.createMeetingForm.get("location").value;
    let meetingDesc: string = this.createMeetingForm.get("description").value;

    let dateTimeEpochMillis: number = this.extractMeetingTimeMillis();

    let publicMeeting: boolean = this.createMeetingForm.get("publicMeeting").value;

    this.taskService.createMeeting(parentType, this.groupUid, meetingSubject, meetingLocation, dateTimeEpochMillis,
      publicMeeting, meetingDesc, this.imageKey, this.assignedMemberUids, this.isGroupPaidFor ? this.meetingImportance : null)
        .subscribe(task => {
          console.log("Meeting successfully created, groupUid: " + this.groupUid + ", taskuid:" + task.taskUid);
          this.initCreateMeetingForm();
          this.confirmingSend = false;
          this.meetingSaved.emit(true);
          this.meetingImportance = "ORDINARY";
        }, error => {
          console.log("Error creating task: ", error);
          this.confirmingSend = false;
          this.meetingSaved.emit(false);
      });
  }

  extractMeetingTimeMillis(): number {
    let mtgDate: NgbDateStruct = this.createMeetingForm.get('date').value;
    let mtgTime: NgbTimeStruct = this.createMeetingForm.get('time').value;
    return DateTimeUtils.momentFromNgbStruct(mtgDate, mtgTime).valueOf();
  }

  addMeetingImage(event){
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

  onChangeSelectImportance(importance:string){
    this.meetingImportance = importance;
  }

}
