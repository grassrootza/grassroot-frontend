import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../task.service';
import {GroupService} from '../../groups/group.service';
import {Membership} from '../../groups/model/membership.model';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {DateTimeUtils, isDateTimeFuture} from "../../utils/DateTimeUtils";
import {MediaService} from "../../media/media.service";
import {MediaFunction} from "../../media/media-function.enum";
import {AlertService} from "../../utils/alert-service/alert.service";

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
  @Output() meetingSaved: EventEmitter<boolean>;
  public membersList: Membership[] = [];

  public confirmingSend: boolean = false;
  public confirmParams;

  public imageName;
  public imageKey;

  public meetingImportance:string = "ORDINARY";

  constructor( private taskService: TaskService,
               private formBuilder: FormBuilder,
               private groupService: GroupService,
               private mediaService: MediaService,
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
      console.log("Create meeting dialog shown for group: " + this.groupUid);
      if (this.groupUid != "" && this.groupUid != undefined) {
        this.groupService.fetchGroupMembers(this.groupUid, 0, 100000, []).subscribe(members => {
          this.membersList = members.content;
          this.setAssignedMembers();
        });
      }
    }.bind(this))
  }

  setAssignedMembers() {
    if (this.preAssignedMemberUids) {
      this.createMeetingForm.get('assignedMemberUids').setValue(this.preAssignedMemberUids, { onlySelf: true })
    }
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
    let membersAssigned = this.createMeetingForm.get("assignedMemberUids").value && this.createMeetingForm.get("assignedMemberUids").value.length > 0;
    let assignedMemberUids = membersAssigned ? this.createMeetingForm.get("assignedMemberUids").value : [];
    let assignedMemberNames = membersAssigned ? this.membersList.filter(member => assignedMemberUids.indexOf(member.user.uid) != -1)
      .map(member => member.user.displayName) : this.membersList.map(member => member.user.displayName);

    let nameText = assignedMemberNames.length > 10 ?
      assignedMemberNames.slice(0, 10).join(", ") + " and " + (assignedMemberNames.length - 10) + " others" : assignedMemberNames.join(", ");

    let time = DateTimeUtils.momentFromNgbStruct(this.createMeetingForm.get('date').value,
      this.createMeetingForm.get('time').value).format('dddd, MMMM Do YYYY, h:mm a');

    this.confirmParams = {
      subject: this.createMeetingForm.get("subject").value,
      location: this.createMeetingForm.get("location").value,
      time: time,
      assignedNumber: membersAssigned ? assignedMemberUids.length : this.membersList.length,
      memberNames: nameText
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
    let meetingDesc: string = this.createMeetingForm.get("description").value;

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

    this.taskService.createMeeting(parentType, this.groupUid, meetingSubject, meetingLocation, dateTimeEpochMillis,
      publicMeeting, meetingDesc, this.imageKey, assignedMemberUids,this.meetingImportance).subscribe(task => {
          console.log("Meeting successfully created, groupUid: " + this.groupUid + ", taskuid:" + task.taskUid);
          console.log("Created meeting with importance",task);
          this.initCreateMeetingForm();
          this.confirmingSend = false;
          this.meetingSaved.emit(true)
        }, error => {
          console.log("Error creating task: ", error);
          this.confirmingSend = false;
          this.meetingSaved.emit(false);
      });
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
    console.log("Setting meeting importance to.....",this.meetingImportance);
  }

}
