import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupInfo} from "../model/group-info.model";
import { GroupService } from '../group.service';
import { AlertService } from 'app/utils/alert-service/alert.service';

declare var $:any;

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.css']
})
export class GroupInfoComponent implements OnInit {

  @Input()
  public group: GroupInfo = null;

  @Output()
  public onGroupClicked: EventEmitter<GroupInfo> = new EventEmitter();

  @Output()
  public pinToggled: EventEmitter<GroupInfo> = new EventEmitter();

  @Output()
  public onTriggerCreateMeeting: EventEmitter<GroupInfo> = new EventEmitter();

  @Output()
  public onTriggerCreateVote: EventEmitter<GroupInfo> = new EventEmitter();

  @Output()
  public onTriggerCreateTodo: EventEmitter<GroupInfo> = new EventEmitter();

  @Output()
  public onTriggerCreateLivewireAlert: EventEmitter<GroupInfo> = new EventEmitter();


  @Input()
  public extendedInfoVisible = false;

  constructor(private groupService: GroupService,
              private alertService: AlertService) {
  }

  ngOnInit() {
  }

  handlePinClick() {
    this.pinToggled.emit(this.group);
  }

  handleChevronPicked(){
    this.extendedInfoVisible = !this.extendedInfoVisible;
  }

  triggerViewGroup() {
    this.onGroupClicked.emit(this.group);
    return false;
  }

  triggerCreateMeetingAction() {
    console.log("Triggering create meeting action for group: " + this.group.groupUid);
    this.onTriggerCreateMeeting.emit(this.group)
  }

  triggerCreateVoteAction() {
    this.onTriggerCreateVote.emit(this.group)
  }

  triggerCreateTodoAction() {
    this.onTriggerCreateTodo.emit(this.group)
  }

  triggerCreateLivewireAlert(){
    this.groupService.canUserCreateLiveWireAlert().subscribe(canCreate => {
      console.log("Can user create????????????????????????????????????",canCreate);
      if(canCreate){
        this.onTriggerCreateLivewireAlert.emit(this.group);
      }else{
        this.alertService.alert("You have been blocked!");
      }
    },error => {
      console.log("Error checking if user can create alert or not", error);
    });
  }

}
