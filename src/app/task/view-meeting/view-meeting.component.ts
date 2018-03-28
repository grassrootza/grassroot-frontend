import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Task} from "../task.model";
import {BroadcastService} from "../../broadcasts/broadcast.service";
import {AlertService} from "../../utils/alert-service/alert.service";
import {MembershipInfo} from "../../groups/model/membership.model";
import {Router} from "@angular/router";
import {TaskService} from "../task.service";
import {TaskType} from "../task-type";
import {MediaService} from "../../media/media.service";
import {MediaFunction} from "../../media/media-function.enum";

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

  public imageUrl;
  public imageLoading = false;

  constructor(private broadcastService: BroadcastService,
              private taskService: TaskService,
              private alertService: AlertService,
              private mediaService: MediaService,
              private router: Router) {
  }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskToView'] && !changes['taskToView'].firstChange && this.taskToView && this.taskToView.type == 'MEETING') {
      this.updateResponses();
      this.fetchImage();
    }
  }

  updateResponses() {
    this.taskService.fetchMeetingResponses(this.taskToView.taskUid).subscribe(responses => {
      this.responses = responses;
    });
  }

  fetchImage() {
    this.taskService.fetchImageKey(this.taskToView.taskUid, TaskType.MEETING).subscribe(response => {
      console.log("image key response: ", response);
      if (response) {
        this.imageLoading = true;
        this.imageUrl = this.mediaService.getImageUrl(MediaFunction.TASK_IMAGE, response);
        console.log("and here is the image URL: ", this.imageUrl);
      } else {
        this.imageUrl = '';
      }
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
    this.router.navigate(['/task/meeting', this.taskToView.taskUid]);
    return false;
  }

  clearData() {
    this.response = "";
    this.sendingBroadcast = false;
  }

}
