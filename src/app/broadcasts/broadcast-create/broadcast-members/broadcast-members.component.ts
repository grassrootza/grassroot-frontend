import {Component, OnInit} from '@angular/core';
import {BroadcastMembers} from "../../model/broadcast-request";
import {BroadcastService} from "../../broadcast.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-broadcast-members',
  templateUrl: './broadcast-members.component.html',
  styleUrls: ['./broadcast-members.component.css']
})
export class BroadcastMembersComponent implements OnInit {

  memberForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private broadcastService: BroadcastService) {
    this.memberForm = formBuilder.group(new BroadcastMembers());
  }

  ngOnInit() {
    this.memberForm.setValue(this.broadcastService.getMembers());
  }

  saveMemberSelection() {
    if (!this.memberForm.valid) {
      return false;
    }
    this.broadcastService.setMembers(this.memberForm.value);
    console.log("stored member selection, looks like: ", this.broadcastService.getMembers());
    return true;
  }

  next() {
    if (this.saveMemberSelection()) {
      this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'schedule']);
    }
  }

  back() {
    // as with content, stash but don't validate
    this.broadcastService.setMembers(this.memberForm.value);
    this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'content']);
  }

  cancel() {
    this.router.navigate([this.broadcastService.cancelRoute()]);
  }

}
