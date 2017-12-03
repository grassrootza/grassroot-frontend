import {Component, OnInit} from '@angular/core';
import {GroupService} from "./group.service";
import {GroupInfo} from "./group-info.model";

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {


  protected groups: GroupInfo[] = [];

  constructor(private groupService: GroupService) {
    this.loadGroups()

  }

  loadGroups() {

    this.groups = [];
    this.groupService.loadGroups().subscribe(
      groupList => {
        console.log("Login response: ", groupList);
        this.groups = groupList;
      },
      err => {
        console.log(err);
        alert("Could not load groups!");
      },
      () => console.log('Request Complete')
    );
  }


  pinGroup(gr: GroupInfo) {
    this.groupService.pinGroup(gr.uid).subscribe(
      success => {
        console.log("pin group success: ", success);
        gr.pinned = true;
      });
  }

  unpinGroup(gr: GroupInfo) {
    this.groupService.unpinGroup(gr.uid).subscribe(
      success => {
        console.log("unpin group success: ", success);
        gr.pinned = false;
      });
  }




  ngOnInit() {
  }

}
