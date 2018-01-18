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
    $("#create-meeting-modal").modal("show");
  }

  meetingSaved(saveResponse){
    console.log(saveResponse);
    $("#create-meeting-modal").modal("hide");
  }

  showCreateVoteModal(){
    $("#create-vote-modal").modal("show");
  }

  voteSaved(saveResponse){
    console.log(saveResponse);
    $("#create-vote-modal").modal("hide");
  }

  showCreateTodoModal(){
    $("#create-todo-modal").modal("show");
  }

  todoSaved(saveResponse){
    console.log(saveResponse);
    $("#create-todo-modal").modal("hide");
  }

}
