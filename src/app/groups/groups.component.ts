import {Component, OnInit} from '@angular/core';
import {GroupService} from "./group.service";
import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Group} from "./group.model";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  private groups_: BehaviorSubject<Group[]> = new BehaviorSubject([]);
  protected groups: Observable<Group[]> = this.groups_.asObservable();

  constructor(private groupService: GroupService) {
    this.loadGroups()

  }

  loadGroups() {

    this.groups_.next([]);
    this.groupService.loadGroups().subscribe(
      groupList => {
        console.log("Login response: ", groupList);
        this.groups_.next(groupList);
      },
      err => {
        console.log(err);
        alert("Could not load groups!");
      },
      () => console.log('Request Complete')
    );
  }

  ngOnInit() {
  }

}
