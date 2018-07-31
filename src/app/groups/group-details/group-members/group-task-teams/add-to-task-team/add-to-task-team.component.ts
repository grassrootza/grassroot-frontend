import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {GroupRef} from "../../../../model/group-ref.model";
import {GroupService} from "../../../../group.service";
import {AlertService} from "../../../../../utils/alert-service/alert.service";
import {Group} from "../../../../model/group.model";
import {Membership} from "../../../../model/membership.model";

declare var $: any;

@Component({
  selector: 'app-add-to-task-team',
  templateUrl: './add-to-task-team.component.html',
  styleUrls: ['./add-to-task-team.component.css']
})
export class AddToTaskTeamComponent implements OnInit, OnChanges {

  @Input() modalId: string = "add-member-to-task-team";
  @Input() group: Group = null;
  @Input() members: Membership[] = null;

  @Output() membersAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectedTaskTeam: GroupRef = null;
  creatingTaskTeam: boolean = false;
  newTaskTeamName: string = null;

  constructor(private groupService: GroupService,
              private alertService: AlertService) { }

  ngOnInit() {
    // console.log("fired up task team modal");
  }

  ngOnChanges() {
    // console.log("add to task team changed, members now: ", this.members);
  }

  toggleNewTeamNameEntry() {
    // console.log("group entity: ", this.group);
    this.creatingTaskTeam = !this.creatingTaskTeam;
    if (!this.creatingTaskTeam) {
      this.newTaskTeamName = null;
    } else {
      this.selectedTaskTeam = null;
    }
  }

  storeNewTeamName(event) {
    this.newTaskTeamName = event.target.value;
  }

  saveAddMemberToTaskTeam(){
    let memberUids: string[] = this.members.map(member => member.userUid);
    // console.log(`creating team: ${this.creatingTaskTeam}, and selected team: ${this.selectedTaskTeam}`);
    if (this.creatingTaskTeam) {
      this.groupService.createTaskTeam(this.group.groupUid, this.newTaskTeamName, memberUids).subscribe(response => {
        this.alertAndCleanUp("group.allMembers.addToTaskTeam.createdDone");
      })
    } else {
      this.groupService.addMembersToTaskTeam(this.group.groupUid, this.selectedTaskTeam.groupUid, memberUids).subscribe(response => {
        this.alertAndCleanUp("group.allMembers.addToTaskTeam.addedDone");
      })
    }
  }

  alertAndCleanUp(alertMessage: string) {
    if (alertMessage) {
      this.alertService.alert(alertMessage);
    }
    $('#' + this.modalId).modal('hide');
    this.membersAdded.emit(true);
    this.resetValues();
  }

  cancelOrClose() {
    // console.log("exiting, reseting");
    this.resetValues();
    $('#' + this.modalId).modal('hide');
  }

  resetValues() {
    if (this.creatingTaskTeam) {
      this.toggleNewTeamNameEntry();
    }
    this.selectedTaskTeam = null;
    this.members = [];
  }

}
