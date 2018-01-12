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
  public pinToggled: EventEmitter<GroupInfo> = new EventEmitter(null);

  @Input()
  public extendedInfoVisible = false;

  public groupUid: string = "";

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

  showCreateMeetingModal(){
    this.groupUid = this.group.groupUid;
    // we hav to add timeout because for some reason modal wont show if we first
    // set groupUid and then try to display it without timeout of 1ms
    setTimeout(function(){
      $("#create-meeting-modal").modal("show");
    }, 1);
  }

  meetingSaved(saveResponse){
    console.log(saveResponse);
    this.groupUid = "";
    $("#create-meeting-modal").modal("hide");
  }

  showCreateVoteModal(){
    this.groupUid = this.group.groupUid;
    setTimeout(function(){
      $("#create-vote-modal").modal("show");
    }, 1);
  }

  voteSaved(saveResponse){
    console.log(saveResponse);
    this.groupUid = "";
    $("#create-vote-modal").modal("hide");
  }

  showCreateTodoModal(){
    this.groupUid = this.group.groupUid;
    setTimeout(function(){
      $("#create-todo-modal").modal("show");
    }, 1);

  }

  todoSaved(saveResponse){
    console.log(saveResponse);
    this.groupUid = "";
    $("#create-todo-modal").modal("hide");
  }

}
