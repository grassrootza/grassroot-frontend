import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GroupService} from "../group.service";
import {GroupRef} from "../model/group-ref.model";

declare var $: any;

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  @Output()
  public onGroupCreated = new EventEmitter<GroupRef>();

  @Output()
  public onGroupCreationFailed = new EventEmitter<any>();

  public createGroupForm: FormGroup;

  constructor(private groupService: GroupService, formBuilder: FormBuilder) {
    this.createGroupForm = formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': '',
      'discoverable': 'true',
      'permissionTemplate': 'DEFAULT_GROUP',
      'reminderMinutes': [0, Validators.pattern("[0-9]+")]
    });
  }

  ngOnInit() {
  }

  createGroup() {

    if (this.createGroupForm.valid) {
      $('#create-group-modal').modal("hide");
      let groupName: string = this.createGroupForm.get("name").value;
      let groupDescription: string = this.createGroupForm.get("description").value;
      let groupPermission: string = this.createGroupForm.get("permissionTemplate").value;
      let reminderMinutes: number = this.createGroupForm.get("reminderMinutes").value;
      let discoverable: string = this.createGroupForm.get("discoverable").value;
      this.groupService.createGroup(groupName, groupDescription, groupPermission, reminderMinutes, discoverable)
        .subscribe(
          groupRef => {
            this.onGroupCreated.emit(groupRef);
          },
          error => {
            this.onGroupCreationFailed.emit(error)
          }
        )
    }
    else {
      console.log("Create group form invalid!");
    }
  }
}
