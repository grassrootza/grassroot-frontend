import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GroupService} from "../../groups/group.service";
import {GroupInfo} from "../../groups/model/group-info.model";
import {Task} from "../../task/task.model";
import {TaskService} from "../../task/task.service";
import {TaskType} from '../../task/task-type';
import {UserService} from "../../user/user.service";
import {LiveWireAlertType} from "../live-wire-alert-type.enum";
import {LiveWireAlertDestType} from "../live-wire-alert-dest-type.enum";
import {LivewireUserService} from "../livewire-user-service";

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
  public imageKeys:string[] = [];
  @Output() alertSaved: EventEmitter<boolean>;

  constructor(private formBuilder: FormBuilder,
              private groupService: GroupService,
              private taskService: TaskService,
              private userService:UserService,
              private liveWireAlertService:LivewireUserService) {
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

  uploadImage(event,input:any){
     let images = [].slice.call(event.target.files);
     console.log("Images m trying to upload....",images);
     this.saveImage(images);
  }

  saveImage(images){
     if(images.length > 0){
        console.log("Images uploaded..",images.length);

        let formData: FormData = new FormData();

        for(let image of images){
          formData.append("file", image, image.name);
          this.liveWireAlertService.uploadAlertImage(formData).subscribe(resp =>{
            this.imageKeys.push(resp.data);
            formData = new FormData();
          },error =>{
            console.log("Error loading image");
          })
        }
        console.log("Image keys.....",this.imageKeys);
        console.log("formdata: ", formData);
     }
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

    this.liveWireAlertService.createLiveWireAlert(this.userUid,headline,this.liveWireAlertType,
      this.groupUid,this.taskUid,this.destinationType,description,this.addLocation,contactPerson,contactName,contactNumber,this.imageKeys).subscribe(alert =>{
        this.createForm();
        this.alertSaved.emit(true);
    },error =>{
      this.createForm();
      this.alertSaved.emit(false);
      console.log("Error creating livewire alert");
    });
  }

}
