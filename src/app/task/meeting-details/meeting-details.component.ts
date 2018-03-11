import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {TaskService} from "../task.service";
import {Task} from "../task.model";
import {convertResponseMap, TaskResponse} from "../task-response";

const RESP_ORDER = {
  'YES': 4, 'NO': 3, 'MAYBE': 2, 'NO_RESPONSE': 1
};

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css']
})
export class MeetingDetailsComponent implements OnInit {

  public meetingUid: string = "";
  public meeting: Task;
  public assignedMembers:number;

  public responses: Map<String, String>;
  public responseArray: TaskResponse[];

  constructor(private route:ActivatedRoute,
              private taskService:TaskService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.meetingUid = params['id'];
      this.viewMeeting();
      this.fetchResponses();
    },error=>{
      console.log("Error getting params....",error);
    });
  }

  viewMeeting(){
    this.taskService.loadTask(this.meetingUid, "MEETING").subscribe(meeting => {
      console.log("Viewing meeting.....",meeting);
      this.meeting = Task.createInstanceFromData(meeting);
    },error=>{
      console.log("Error loading meeting......",error);
    })
  }

  fetchResponses() {
    this.taskService.fetchMeetingResponses(this.meetingUid).subscribe(responses => {
      this.responses = responses;
      this.responseArray = convertResponseMap(responses);
      this.responseArray.sort((task1, task2) => {
        if (task1.response == task2.response)
          return task1.memberName > task2.memberName ? 1 : task2.memberName > task1.memberName ? -1 : 0;
        else
          return RESP_ORDER[task1.response] > RESP_ORDER[task2.response] ? -1 : 1;
      })
    })
  }

}
