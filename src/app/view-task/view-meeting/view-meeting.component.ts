import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../../task/task.model";
import {BroadcastService} from "../../broadcasts/broadcast.service";
import {AlertService} from "../../utils/alert.service";
import {MembershipInfo} from "../../groups/model/membership.model";
import {Router} from "@angular/router";

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
  public members: MembershipInfo[] = [];

  constructor(private broadcastService: BroadcastService,
              private alertService: AlertService,
              private router: Router) {
  }

  ngOnInit() {
  }

  sendBroadcastMessage() {
    this.broadcastService.sendMeetingBroadcast(this.taskToView.taskUid, this.broadcastMessage).subscribe(result => {
      this.alertService.alert("task.meeting.broadcast.done");
      $('#view-meeting-modal').modal('hide');
    });
  }

  viewAllAttendees(){
    console.log("Task to view....",this.taskToView.taskUid);

    $("#view-meeting-modal").modal("hide");

    this.router.navigate(['/meeting', this.taskToView.taskUid]);
    return false;
  }

}
