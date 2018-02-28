import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../../task/task.model";
import {BroadcastService} from "../../broadcasts/broadcast.service";
import {AlertService} from "../../utils/alert.service";

declare var $: any;

@Component({
  selector: 'app-view-meeting',
  templateUrl: './view-meeting.component.html',
  styleUrls: ['./view-meeting.component.css']
})
export class ViewMeetingComponent implements OnInit {

  @Input()
  public taskToView:Task;

  broadcastMessage: string = null;

  constructor(private broadcastService: BroadcastService,
              private alertService: AlertService) {

  }

  ngOnInit() {
  }

  sendBroadcastMessage() {
    this.broadcastService.sendMeetingBroadcast(this.taskToView.taskUid, this.broadcastMessage).subscribe(result => {
      this.alertService.alert("task.meeting.broadcast.done");
      $('#view-meeting-modal').modal('hide');
    });
  }

}
