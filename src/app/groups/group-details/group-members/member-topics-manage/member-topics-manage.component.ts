import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Group} from "../../../model/group.model";
import {Membership} from "../../../model/membership.model";
import {GroupService} from "../../../group.service";
import {AlertService} from "../../../../utils/alert-service/alert.service";

declare var $: any;

@Component({
  selector: 'app-member-topics-manage',
  templateUrl: './member-topics-manage.component.html',
  styleUrls: ['./member-topics-manage.component.css']
})
export class MemberTopicsManageComponent implements OnInit{

  @Input() modalId: string = "member-assign-topics";
  @Input() selectId: string = "topics-multi-select-member";

  @Input() group: Group = null;
  @Input() applyToAllMembers: boolean = false;
  @Input() memberUids: string[] = null;

  priorTopics: string[] = [];
  modalSelectedTopics: string[] = [];

  @Output() topicsAssigned: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private groupService: GroupService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.setupTopicSelect();
  }

  setupTopicSelect(preSelectedTopics: string[] = []) {
    let component = $("#" + this.selectId);
    component.select2({
      placeholder: "Select topics, or type and hit enter for a new one)",
      dropdownParent: $('#' + this.modalId),
      tags: true,
      allowClear: true,
    });

    component.on('change.select2', function () {
      const data = component.select2('data');
      this.modalSelectedTopics = data.length > 0 ? data.map(tt => tt.id) : [];
    }.bind(this));

    this.priorTopics = preSelectedTopics;
    component.val(preSelectedTopics);
    component.trigger('change');
  }


  saveAssignTopicToMember() {
    let onlyAddTopics: boolean = this.memberUids.length > 1; // if it's multiple members (so don't overwrite)
    console.log('Assigning members to topics ... apply to all ? ', this.applyToAllMembers);
    this.alertService.showLoading();
    this.groupService.assignTopicToMember(this.group.groupUid, this.memberUids, this.modalSelectedTopics, this.applyToAllMembers, onlyAddTopics)
    .subscribe(() => {
      this.alertService.hideLoading();
      $('#' + this.modalId).modal('hide');
      this.alertService.alert("group.allMembers.assignTopic.assigned");
      this.topicsAssigned.emit(true);
    }, error => {
      this.alertService.hideLoading();
      console.log('well that failed: ', error);
    });

    // if we have multiple members and deliberately removed a topic from all, tell backend to remove it too
    let removedTopics = this.priorTopics.filter(topic => this.modalSelectedTopics.indexOf(topic) == -1);
    if (onlyAddTopics && removedTopics && removedTopics.length > 0) {
      console.log("change in topics on bulk modal, remove = ", removedTopics);
      this.groupService.removeTopicFromMembers(this.group.groupUid, this.memberUids, removedTopics, this.applyToAllMembers).subscribe(response => {
        console.log("removal result: ", response);
      }, error => {
        console.log("error on removal: ", error);
      })
    }

  }

}
