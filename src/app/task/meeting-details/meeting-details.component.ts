import {Component, Input, OnInit} from '@angular/core';

import {ActivatedRoute, Params} from "@angular/router";
import {TaskService} from "../task.service";
import {UserService} from "../../user/user.service";
import {Task} from "../task.model";

@Component({
  selector: 'app-meeting-details',
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css']
})
export class MeetingDetailsComponent implements OnInit {

  public meetingUid:string = "";
  public meeting:Task;
  public assignedMembers:number;
  public responseYes:number;
  public responsesNo:number;
  public responseMaybe:number;
  public noResponse:number;

  public totalYes:number;
  public totalNo:number;
  public totalMaybe:number;
  public totalNoResponse:number;

  public rsvps:any[];
  public values:string[] = [];

  constructor(private route:ActivatedRoute,
              private taskService:TaskService,
              private userService:UserService) {
    console.log("constructing meeting details component");
  }

  ngOnInit() {
    console.log("initing meeting details component");
    this.route.params.subscribe((params:Params)=>{
      this.meetingUid = params['id'];
      this.viewMeeting(this.meetingUid);
      this.meetingRsvps(this.meetingUid);
    },error=>{
      console.log("Error getting params....",error);
    });
  }

  viewMeeting(id:string){
    this.taskService.viewMeeting(id,this.userService.getLoggedInUser().msisdn).subscribe(meeting=>{
      console.log("Viewing meeting.....",meeting);
      this.meeting = Task.createInstanceFromData(meeting.data);
      this.assignedMembers = meeting.data.assignedMemberCount;
      this.responseYes = (meeting.data.totals.yes / this.assignedMembers) * 100;
      this.responsesNo = (meeting.data.totals.no / this.assignedMembers) * 100;
      this.responseMaybe = (meeting.data.totals.maybe / this.assignedMembers) * 100;
      this.noResponse = (meeting.data.totals.invalid / this.assignedMembers) * 100;

      this.totalYes = meeting.data.totals.yes;
      this.totalNo = meeting.data.totals.no;
      this.totalMaybe = meeting.data.totals.maybe;
      this.totalNoResponse = meeting.data.totals.invalid;

      console.log(this.assignedMembers);
      console.log("Task..........",this.meeting);
      console.log("Yes............",this.responseYes);
    },error=>{
      console.log("Error loading meeting......",error);
    })
  }

  meetingRsvps(id:string){
    this.taskService.meetingRsvps(this.userService.getLoggedInUser().msisdn,id).subscribe(rsvps=>{
      console.log("RSVPS...",rsvps);

      /*if(rsvps.numberInvited < 100){
        this.rsvps = Object.keys(rsvps.rsvpResponses);
        this.rsvps.forEach(r => this.values.push(rsvps.rsvpResponses[r]));
      }*/

      this.rsvps = Object.keys(rsvps.rsvpResponses);
      this.rsvps.forEach(r => this.values.push(rsvps.rsvpResponses[r]));
      console.log("Keys............",this.rsvps);
      console.log("Values..........",this.values);
    },error=>{
      console.log("Error....",error);
    });
  }

}
