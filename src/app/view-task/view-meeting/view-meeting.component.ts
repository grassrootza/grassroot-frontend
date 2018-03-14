import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Task} from "../../task/task.model";
import {BroadcastService} from "../../broadcasts/broadcast.service";
import {AlertService} from "../../utils/alert.service";
import {MembershipInfo} from "../../groups/model/membership.model";
import {Router} from "@angular/router";
import {TaskService} from "../../task/task.service";

declare var $: any;

@Component({
  selector: 'app-view-meeting',
  templateUrl: './view-meeting.component.html',
  styleUrls: ['./view-meeting.component.css']
})
export class ViewMeetingComponent implements OnInit, OnChanges {

  @Input() public taskToView: Task;

  sendingBroadcast: boolean = false;
  broadcastMessage: string = null;
  sendToOnlyYes: boolean = true;

  public members: MembershipInfo[] = [];
  public responses: Map<string, string>;

  public response: string = "";
  public responseOptions: string[] = ['YES', 'NO', 'MAYBE'];

  constructor(private broadcastService: BroadcastService,
              private taskService: TaskService,
              private alertService: AlertService,
              private router: Router) {
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskToView'] && !changes['taskToView'].firstChange && this.taskToView && this.taskToView.type == 'MEETING') {
      this.updateResponses();
    }
  }

  updateResponses() {
    this.taskService.fetchMeetingResponses(this.taskToView.taskUid).subscribe(responses => {
      this.responses = responses;
    });
  }

  respondToMeeting() {
    this.taskService.respondToMeeting(this.taskToView.taskUid, this.response).subscribe(updatedResponses => {
      this.responses = updatedResponses;
    })
  }

  sendBroadcastMessage() {
    this.broadcastService.sendMeetingBroadcast(this.taskToView.taskUid, this.broadcastMessage, this.sendToOnlyYes).subscribe(result => {
      this.alertService.alert("task.meeting.broadcast.done");
      this.sendingBroadcast = false;
      this.sendToOnlyYes = true;
      this.broadcastMessage = null;
      $('#view-meeting-modal').modal('hide');
    });
  }

  viewAllAttendees(){
    $("#view-meeting-modal").modal("hide");
    this.router.navigate(['/meeting', this.taskToView.taskUid]);
    return false;
  }

  clearData() {
    this.response = "";
    this.sendingBroadcast = false;
  }

}
