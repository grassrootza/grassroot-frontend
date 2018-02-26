import {Component, Input, OnInit} from '@angular/core';
import {MembershipInfo} from "../../groups/model/membership.model";
import {Task} from "../task.model";

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css']
})
export class MeetingDetailsComponent implements OnInit {

  @Input()
  public taskToView:Task;

  constructor() {
    console.log("constructing meeting details component");
  }

  ngOnInit() {
    console.log("initing meeting details component");
  }

}
