import {Component, Input, OnInit,Output,EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GroupService} from "../../../group.service";
import {GroupInfo} from "../../../model/group-info.model";
import {Task} from "../../../../task/task.model";
import {TaskService} from "../../../../task/task.service";
import {TaskType} from '../../../../task/task-type';
import {UserService} from "../../../../user/user.service";
import {LiveWireAlertType} from "../../../../livewire/live-wire-alert-type.enum";
import {LiveWireAlertDestType} from "../../../../livewire/live-wire-alert-dest-type.enum";

declare var $: any;

@Component({
  selector: 'app-create-livewire',
  templateUrl: './create-livewire.component.html',
  styleUrls: ['./create-livewire.component.css']
})
export class CreateLivewireComponent implements OnInit {

  public createLivewireForm : FormGroup;
  public headline: FormControl;
  public groups: GroupInfo[] = [];
  public meetings: Task[] = [];
  @Input() groupUid: string = "";
  public userUid:string = "";
  public taskUid:string = "";
  public destination:string = "";
  public addLocation:boolean = false;
  public liveWireAlertType:LiveWireAlertType;
  public destinationType:LiveWireAlertDestType;
  public imageKey:string = "";
  @Output() alertSaved: EventEmitter<boolean>;


  public imageFileToUpload:File;


  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService,
              private taskService: TaskService,
              private userService:UserService) {
      this.alertSaved = new EventEmitter<boolean>();
   }

  ngOnInit() {
    this.userUid = this.userService.getLoggedInUser().userUid;
    this.createForm();

    $('#create-livewire-alert-modal').on('shown.bs.modal', function () {
      this.fetchMeetingsForGroup();
    }.bind(this));
  }

  createForm(){
    this.createLivewireForm = this.formBuilder.group({
      headline : new FormControl('',Validators.required),
      contact: new FormControl(),
      contactPersonName: new FormControl(),
      contactPersonNumber: new FormControl(),
      alertType: new FormControl(),
      articleText: new FormControl(),
      selectMeeting:new FormControl(),
      destination:new FormControl(),
      file:new FormControl()
    });
  }

  fetchUserGroups(){
      this.groupService.groupInfoList.subscribe(groups =>{
        console.log("Fetched groups...............",groups);
        this.groups = groups;
      })
  }

  fetchMeetingsForGroup(){
    this.taskService.loadUpcomingGroupTasks(this.groupUid).subscribe(tasks =>{
      this.meetings = tasks.filter(task => task.type == TaskType.MEETING);
      console.log("Meetings for group",this.meetings + "");
    });
  }

  onChangeSelectMeeting(taskUid){
    console.log("Meeting UID",taskUid);
    this.taskUid = taskUid;
  }

  selectDest(destination){
    console.log("DEST",destination);
    this.destination = destination;
  }

  uploadImage(event){
     this.saveImage(event.target.files);
  }

  saveImage(images){
     if(images.length > 0){
        let image = images[0];
        let formData: FormData = new FormData();
        formData.append("file", image, image.name);
        console.log("formdata: ", formData);

        this.taskService.uploadAlertImage(formData).subscribe(resp =>{
          console.log("Resp",resp);
          this.imageKey = resp.data;
          console.log("Image Key...........",this.imageKey);
        },error =>{
          console.log("Error loading image");
        })
     }
  }


  createLivewire(){

    let contactPerson = this.createLivewireForm.get("contact").value;
    let headline = this.createLivewireForm.get("headline").value;
    let description = this.createLivewireForm.get("articleText").value;
    let type = this.createLivewireForm.get("alertType").value;
    let contactName = this.createLivewireForm.get("contactPersonName").value;
    let contactNumber = this.createLivewireForm.get("contactPersonNumber").value;
    let mediaKeys = new Set<string>();

    if(this.imageKey != null){
      mediaKeys.add(this.imageKey);
    }

    if(this.meetings.length > 0){
      this.liveWireAlertType = type === "general"? LiveWireAlertType.INSTANT:LiveWireAlertType.MEETING;
    }else {
      this.liveWireAlertType = LiveWireAlertType.INSTANT;
    }

    this.destinationType = this.destination == "SINGLE_AND_PUBLIC"? LiveWireAlertDestType.SINGLE_AND_PUBLIC :
      (this.destination == "PUBLIC_LIST"?LiveWireAlertDestType.PUBLIC_LIST:LiveWireAlertDestType.SINGLE_LIST);

    console.log("Task ID******",this.taskUid);

    this.taskService.createLiveWireAlert(this.userUid,headline,this.liveWireAlertType,
      this.groupUid,this.taskUid,this.destinationType,description,this.addLocation,contactPerson,contactName,contactNumber,mediaKeys).subscribe(alert =>{
        this.createForm();
        this.alertSaved.emit(true);
        console.log("Succesfully created livewirealert*****************");
        console.log("Key.....",this.imageKey);
    },error =>{
      this.createForm();
      this.alertSaved.emit(false);
      console.log("Error creating livewire alert");
    });
  }

}
