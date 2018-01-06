import {Component, OnInit} from '@angular/core';
import {TaskService} from "../task/task.service";
import {UserService} from "../user/user.service";
import {Task} from "../task/task.model";
import {DatePipe} from "@angular/common";
import {GroupService} from "../groups/group.service";
import {GroupInfo} from "../groups/model/group-info.model";
import {MembersPage} from "../groups/model/membership.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public myTasks: Map<string, Task[]> = new Map();
  public pinnedGroups: GroupInfo[] = [];
  public newMembersPage: MembersPage = null;


  constructor(private taskService: TaskService,
              private userService: UserService,
              private groupService: GroupService) {
  }

  ngOnInit() {

    console.log("fetching tasks for homepage");
    let newTasks: Map<string, Task[]> = new Map();
    this.taskService.loadUpcomingUserTasks(this.userService.getLoggedInUser().userUid)
      .subscribe(tasks => {
        tasks.forEach(t => {
          let taskDate = this.formatTaskDate(t.deadlineDate);
          let dayTasks = newTasks.get(taskDate);
          if (!dayTasks) {
            dayTasks = [];
            newTasks.set(taskDate, dayTasks);
          }
          dayTasks.push(t)
        });

        this.myTasks = newTasks;
        console.log("Fetched my tasks:", this, this.myTasks);
      })

    this.groupService.groupInfoList.subscribe(
      groups => {
        this.pinnedGroups = groups.filter(gr => gr.pinned)
      }
    );
    this.groupService.loadGroups(false)

    this.groupService.fetchNewMembers(7, 0, 20)
      .subscribe(newMembersPage => {
        this.newMembersPage = newMembersPage;
      });
  }

  formatTaskDate(date: Date): string {
    return new DatePipe("en").transform(date, "EEEE, dd MMM yyyy");
  }
}
