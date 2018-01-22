import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupInfo} from "../model/group-info.model";

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
  public pinToggled: EventEmitter<GroupInfo> = new EventEmitter();

  @Output()
  public onTriggerCreateMeeting: EventEmitter<GroupInfo> = new EventEmitter();

  @Output()
  public onTriggerCreateVote: EventEmitter<GroupInfo> = new EventEmitter();

  @Output()
  public onTriggerCreateTodo: EventEmitter<GroupInfo> = new EventEmitter();


  @Input()
  public extendedInfoVisible = false;

  constructor() {
  }

  ngOnInit() {
  }

  handlePinClick() {
    this.pinToggled.emit(this.group);
  }

  handleChevronPicked(){
    this.extendedInfoVisible = !this.extendedInfoVisible;
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

}
