import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../../task/task.model";
import {GroupService} from "../../groups/group.service";
import {Group} from "../../groups/model/group.model";
import {MembershipInfo} from "../../groups/model/membership.model";
import {Router} from "@angular/router";
import {TaskService} from "../../task/task.service";
import {UserService} from "../../user/user.service";

declare var $: any;

@Component({
  selector: 'app-view-meeting',
  templateUrl: './view-meeting.component.html',
  styleUrls: ['./view-meeting.component.css']
})
export class ViewMeetingComponent implements OnInit {

  @Input()
  public taskToView:Task;

  public members:MembershipInfo[] = [];

  constructor(private router:Router) { }

  ngOnInit() {
  }

  viewAllAttendees(){
    console.log("Task to view....",this.taskToView.taskUid);

    $("#view-meeting-modal").modal("hide");

    this.router.navigate(['/meeting', this.taskToView.taskUid]);
    return false;
  }

}
