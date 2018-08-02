import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../task.service';
import {GroupService} from '../../groups/group.service';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {Membership} from '../../groups/model/membership.model';
import {MediaFunction} from "../../media/media-function.enum";
import {AlertService} from "../../utils/alert-service/alert.service";
import {MediaService} from "../../media/media.service";
import {DateTimeUtils, isDateTimeFuture} from "../../utils/DateTimeUtils";
import { TaskPreview } from '../task-preview.model';
import { environment } from 'environments/environment';

declare var $: any;

const TodoTypes: any[] =
  [
    { "value": "VOLUNTEERS_NEEDED", "name": "Volunteer"},
    { "value": "ACTION_REQUIRED", "name": "Take action" },
    { "value": "INFORMATION_REQUIRED", "name": "Respond with information" },
    { "value": "VALIDATION_REQUIRED", "name": "Validate action" }
  ];

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css']
})
export class CreateTodoComponent implements OnInit {

  public todoTypes = TodoTypes;
  public createTodoForm: FormGroup;
  // private membersPage: MembersPage = new MembersPage(0, 0, 0, 0, true, false, []);

  public memberCount: number;
  public showMemberAssignment: boolean = false;
  public possibleAssignedMembers: Membership[] = [];
  public possibleConfirmingMembers: Membership[] = [];

  private groupMembers: Membership[] = [];
  private assignedMemberUids: string[];
  private confirmingMemberUids: string[];

  @Input() groupUid: string;
  @Input() preAssignedMemberUids: string[] = [];
  @Input() preAssignedMemberNames: string[] = [];

  @Output() todoSaved: EventEmitter<boolean>;

  public imageName;
  public imageKey;

  public confirmingSend: boolean;
  public confirmParams: {};
  public taskPreview: TaskPreview;

  constructor(private taskService: TaskService,
              private groupService: GroupService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private mediaService: MediaService) {
    this.initCreateTodoForm();
    this.todoSaved = new EventEmitter<boolean>();
  }

  ngOnInit() {
    $('#create-todo-modal').on('shown.bs.modal', function () {
      this.initCreateTodoForm();
    }.bind(this));
  }

  initCreateTodoForm(){
    this.createTodoForm = this.formBuilder.group({
      'todoType': TodoTypes[0].value,
      'subject': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'date': [DateTimeUtils.nowAsDateStruct(), Validators.required],
      'time': [DateTimeUtils.futureTimeStruct(0, 0), Validators.required],
      'parentType': 'GROUP'
    }, { validator: isDateTimeFuture("date", "time") });

    let selectedTodoType = this.createTodoForm.controls['todoType'].value;
    this.setControlsOnType(selectedTodoType);

    if(this.groupUid != "" && this.groupUid != undefined) {
      console.log('fetching group details ... ');;
      this.groupService.loadGroupDetailsCached(this.groupUid, false).subscribe(group => {
        console.log('got group details, member count: ', group.memberCount);
        this.memberCount = group.memberCount;
        this.fetchGroupMembers();
      })
    }
  }

  fetchGroupMembers(){
    if (this.memberCount < environment.memberFetchCutOff) {
      this.showMemberAssignment = true;
      this.groupService.fetchGroupMembers(this.groupUid, 0, 100000, []).subscribe(members =>{
        this.groupMembers = members.content;
        this.possibleAssignedMembers = this.groupMembers;
        this.possibleConfirmingMembers = this.groupMembers;
        this.setAssignedMembers();
      });
    } else {
      this.showMemberAssignment = false;
    }
  }

  setAssignedMembers() {
    if (this.preAssignedMemberUids) {
      this.createTodoForm.get('assignedMemberUids').setValue(this.preAssignedMemberUids, { onlySelf: true })
    }
  }

  toggleAssignedMembers() {
    if (this.showMemberAssignment) {
      this.showMemberAssignment = false;
    } else {
      this.fetchGroupMembers();
    }
    return false;
  }

  initInformationRequiredTodo(){
    this.createTodoForm.addControl('responseTag', new FormControl('', Validators.required));
    this.createTodoForm.addControl('assignedMemberUids', new FormControl([]));
    // console.log("initInformationRequiredTodo");
  }

  initValidationRequiredTodo() {
    // console.log("initValidationRequiredTodo");
    this.createTodoForm.addControl("requireImages",new FormControl(false));
    this.createTodoForm.addControl("assignedMemberUids", new FormControl([], Validators.required));
    this.createTodoForm.addControl("confirmingMemberUids", new FormControl([], Validators.required));
  }

  initActionRequiredTodo(){
    this.createTodoForm.addControl("recurring", new FormControl(false));
    this.createTodoForm.addControl("recurringPeriodMillis", new FormControl(0));
    this.createTodoForm.addControl("assignedMemberUids", new FormControl([]));

    // console.log("initActionRequiredTodo");
  }

  initVolunteersNeededTodo(){
    // console.log("initVolunteersNeededTodo");
    this.createTodoForm.addControl("assignedMemberUids", new FormControl([]));

  }

  todoTypeChanged(todoType){
    //on todoType changed clear all additional controls and then add ones according to type.
    this.removeAllAdditionalControls();
    this.setControlsOnType(todoType);
  }

  setControlsOnType(selectedTodoType) {
    if(selectedTodoType == 'INFORMATION_REQUIRED'){
      this.initInformationRequiredTodo();
    }else if(selectedTodoType == 'VALIDATION_REQUIRED'){
      this.initValidationRequiredTodo();
    }else if(selectedTodoType == 'ACTION_REQUIRED'){
      this.initActionRequiredTodo();
    }else if(selectedTodoType == 'VOLUNTEERS_NEEDED'){
      this.initVolunteersNeededTodo();
    }
  }

  removeAllAdditionalControls(){
    this.createTodoForm.removeControl("responseTag");
    this.createTodoForm.removeControl("requireImages");
    this.createTodoForm.removeControl("assignedMemberUids");
    this.createTodoForm.removeControl("confirmingMemberUids");
    this.createTodoForm.removeControl("recurring");
    this.createTodoForm.removeControl("recurringPeriodMillis");
  }

  assignedMemberUidsPicked() {
    let memberUids: string[] = this.createTodoForm.controls['assignedMemberUids'].value;
    // user feedback suggests removing this contraint (user can't be both assigned and confirming at once), but leaving code in here in case change back in future
    // this.possibleConfirmingMembers = memberUids.length == 0 ? this.groupMembers :
    //   this.possibleConfirmingMembers = this.groupMembers.filter(member => memberUids.indexOf(member.user.uid) == -1);
  }

  confirmingMemberUidsPicked() {
    let memberUids: string[] = this.createTodoForm.controls['confirmingMemberUids'].value;
    // user feedback suggests removing this contraint, but leaving code in here in case change back in future
    // this.possibleAssignedMembers = memberUids.length == 0 ? this.groupMembers :
    //   this.groupMembers.filter(member => memberUids.indexOf(member.user.uid) == -1);
  }

  next() {
    if (this.createTodoForm.valid) {
      if (this.confirmingSend)
        this.createTodo();
      else
        this.confirmTodo();
    }
  }

  confirmTodo() {
    const membersSelected = this.createTodoForm.get("assignedMemberUids").value && this.createTodoForm.get("assignedMemberUids").value.length > 0;
    const membersAssigned = membersSelected || this.preAssignedMemberUids.length > 0;
    
    this.assignedMemberUids = [];
    let assignedMemberNames = [];
    
    if (this.memberCount > environment.memberFetchCutOff) {
      // means members selected via a bulk manage etc but not selected here, so, retain
      this.assignedMemberUids = this.preAssignedMemberUids;
      assignedMemberNames = this.preAssignedMemberNames;
    } else if (membersSelected) {
      this.assignedMemberUids = this.createTodoForm.get("assignedMemberUids").value;
      assignedMemberNames = this.groupMembers.filter(member => this.assignedMemberUids.indexOf(member.userUid) != -1)
        .map(member => member.displayName);
    } else {
      assignedMemberNames = this.groupMembers.map(member => member.displayName)
    }

    let nameText = !membersAssigned ? ' the whole group' : assignedMemberNames.length > 10 ?
      assignedMemberNames.slice(0, 10).join(", ") + " and " + (assignedMemberNames.length - 10) + " others" : assignedMemberNames.join(", ");

    let time = DateTimeUtils.momentFromNgbStruct(this.createTodoForm.get('date').value,
      this.createTodoForm.get('time').value).format('dddd, MMMM Do YYYY, h:mm a');

    this.confirmParams = {
      subject: this.createTodoForm.get("subject").value,
      type: this.createTodoForm.get("todoType").value,
      time: time,
      membersAssigned: membersAssigned,
      assignedNumber: membersAssigned ? this.assignedMemberUids.length : this.memberCount,
      memberNames: nameText
    };

    this.confirmingSend = true;

    this.taskService.loadPreviewTodo(this.confirmParams['type'], this.groupUid, this.confirmParams['subject'], this.extractDeadlineMillis(), 
        '', this.imageKey).subscribe(preview => {
          this.taskPreview = preview;
        }, error => {
          console.log('error generating preview: ', error);
        })
  }

  createTodo() {
    let todoType: string = this.createTodoForm.get("todoType").value;
    let parentType: string = this.createTodoForm.get("parentType").value;
    let subject: string = this.createTodoForm.get("subject").value;

    let responseTag: string = "";
    if (this.createTodoForm.get("responseTag") != null){
      responseTag = this.createTodoForm.get("responseTag").value;
    }

    let dueTimemilis: number = this.extractDeadlineMillis();

    this.assignedMemberUids = this.createTodoForm.get("assignedMemberUids").value;

    this.confirmingMemberUids = this.createTodoForm.get("confirmingMemberUids") ?
      this.createTodoForm.get("confirmingMemberUids").value : [];

    let requireImages: boolean = false;
    if(this.createTodoForm.get("requireImages") != null){
      requireImages = this.createTodoForm.get("requireImages").value;
    }

    let recurring: boolean = false;
    if(this.createTodoForm.get("recurring") != null){
      recurring = this.createTodoForm.get("recurring").value;
    }

    let recurringInterval: number = 0;
    if(this.createTodoForm.get("recurringPeriodMillis") != null){
      recurringInterval = this.createTodoForm.get("recurringPeriodMillis").value*60000;
    }

    this.taskService.createTodo(todoType, parentType, this.groupUid, subject, dueTimemilis, responseTag, requireImages,
      recurring, recurringInterval, this.imageKey, this.assignedMemberUids, this.confirmingMemberUids)
      .subscribe(task => {
        console.log("Todo successfully created, groupUid: " + this.groupUid + ", taskUid: " + task.taskUid);
        this.initCreateTodoForm();
        this.imageKey = null;
        this.imageName = null;
        this.confirmingSend = false;
        this.todoSaved.emit(true);
      }, error => {
        console.log("Error creating task: ", error);
        this.todoSaved.emit(false);
      })
  }

  extractDeadlineMillis(): number {
    let todoDate: NgbDateStruct = this.createTodoForm.get('date').value;
    let todoTime: NgbTimeStruct = this.createTodoForm.get('time').value;
    return DateTimeUtils.momentFromNgbStruct(todoDate, todoTime).valueOf();
  }

  addTodoImage(event){
    let images = event.target.files;
    if(images.length > 0){
      let image = images[0];
      this.alertService.showLoading();
      this.mediaService.uploadMedia(image, MediaFunction.TASK_IMAGE).subscribe(resp =>{
        this.imageKey = resp;
        this.imageName = image.name;
        this.alertService.hideLoading();
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
