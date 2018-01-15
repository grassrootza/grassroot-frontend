import {Component, OnInit} from '@angular/core';
import {BroadcastCost, BroadcastMembers} from "../../model/broadcast-request";
import {BroadcastService} from "../../broadcast.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup} from "@angular/forms";
import {BroadcastParams} from "../../model/broadcast-params";

@Component({
  selector: 'app-broadcast-members',
  templateUrl: './broadcast-members.component.html',
  styleUrls: ['./broadcast-members.component.css', '../broadcast-create.component.css']
})
export class BroadcastMembersComponent implements OnInit {

  memberForm: FormGroup;

  public createParams: BroadcastParams;
  public countParams: BroadcastCost;

  constructor(private router: Router, private formBuilder: FormBuilder, private broadcastService: BroadcastService) {
    this.createParams = this.broadcastService.getCreateParams();
    console.log("on construction, create params: ", this.createParams);
    this.memberForm = formBuilder.group(new BroadcastMembers());
  }

  ngOnInit() {
    this.calculateCosts();
    this.memberForm.setValue(this.broadcastService.getMembers());
    this.broadcastService.createParams.subscribe(createParams => {
      this.createParams = createParams;
      this.calculateCosts();
    })
  }

  calculateCosts() {
    let types = this.broadcastService.getTypes();
    this.countParams = new BroadcastCost();
    this.countParams.smsNumber = types.shortMessage ? this.createParams.allMemberCount : 0;
    this.countParams.broadcastCost = (this.countParams.smsNumber * this.createParams.smsCostCents / 100).toFixed(2);
    console.log("count params: ", this.countParams);
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
      this.broadcastService.setPageCompleted('members');
      this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'schedule']);
    }
  }

  back() {
    // as with content, stash but don't validate
    this.broadcastService.setMembers(this.memberForm.value);
    this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'content']);
  }

  cancel() {
    this.broadcastService.cancelCurrentCreate();
  }

}
