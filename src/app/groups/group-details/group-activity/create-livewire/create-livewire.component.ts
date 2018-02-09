import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GroupService} from "../../../group.service";
import {GroupInfo} from "../../../model/group-info.model";
import {Task} from "../../../../task/task.model";
import {TaskService} from "../../../../task/task.service";
import {TaskType} from 'app/task/task-type';
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

  public imageFileToUpload:File;


  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService,
              private taskService: TaskService,
              private userService:UserService) { }

  ngOnInit() {
    this.userUid = this.userService.getLoggedInUser().userUid;
    this.createLivewireForm = this.formBuilder.group({
      headline : new FormControl('',Validators.required),
      contact: new FormControl(),
      contactPersonName: new FormControl(),
      contactPersonNumber: new FormControl(),
      alertType: new FormControl(),
      articleText: new FormControl(),
      selectMeeting:new FormControl(),
      destination:new FormControl(),
      imageFIle:new FormControl()
    });

    $('#create-livewire-alert-modal').on('shown.bs.modal', function () {
      this.fetchMeetingsForGroup();
    }.bind(this));
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

  uploadImage(file:FileList){
     this.imageFileToUpload = file.item(0);
     let formData: FormData = new FormData();
     formData.append("image",this.imageFileToUpload);

     this.taskService.uploadAlertImage(this.imageFileToUpload,this.userUid,formData).subscribe(data =>{
      console.log("Media File or Image to upload",data);
      this.imageKey = data;
    },error =>{
      console.log("Error",error);
    })
  }


  createLivewire(){
    
    let contactPerson = this.createLivewireForm.get("contact").value;
    let headline = this.createLivewireForm.get("headline").value;
    let description = this.createLivewireForm.get("articleText").value;
    let type = this.createLivewireForm.get("alertType").value;
    let contactName = this.createLivewireForm.get("contactPersonName").value;
    let contactNumber = this.createLivewireForm.get("contactPersonNumber").value;

    if(this.meetings.length > 0){
      this.liveWireAlertType = type === "general"? LiveWireAlertType.INSTANT:LiveWireAlertType.MEETING;
    }else {
      this.liveWireAlertType = LiveWireAlertType.INSTANT;
    }

    this.destinationType = this.destination == "SINGLE_AND_PUBLIC"? LiveWireAlertDestType.SINGLE_AND_PUBLIC :
      (this.destination == "PUBLIC_LIST"?LiveWireAlertDestType.PUBLIC_LIST:LiveWireAlertDestType.SINGLE_LIST);

    console.log("Task ID******",this.taskUid);

    

    this.taskService.createLiveWireAlert(this.userUid,headline,this.liveWireAlertType,
      this.groupUid,this.taskUid,this.destinationType,description,this.addLocation,contactPerson,contactName,contactNumber).subscribe(alert =>{
        console.log("Succesfully created livewirealert*****************");
        console.log("Key.....",this.imageKey);
    },error =>{
      console.log("Error creating livewire alert");
    });
  }

}
