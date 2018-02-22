import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../../task/task.model";

@Component({
  selector: 'app-view-meeting',
  templateUrl: './view-meeting.component.html',
  styleUrls: ['./view-meeting.component.css']
})
export class ViewMeetingComponent implements OnInit {

  @Input()
  public taskToView:Task;

  constructor() { }

  ngOnInit() {
  }

}
