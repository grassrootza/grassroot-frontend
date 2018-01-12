import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BroadcastService} from "../../broadcast.service";
import {Router} from "@angular/router";
import {BroadcastConfirmation, BroadcastContent} from "../../model/broadcast-request";
import {AlertService} from "../../../utils/alert.service";

@Component({
  selector: 'app-broadcast-confirm',
  templateUrl: './broadcast-confirm.component.html',
  styleUrls: ['./broadcast-confirm.component.css', '../broadcast-create.component.css']
})
export class BroadcastConfirmComponent implements OnInit {

  public confirmFields: BroadcastConfirmation;
  public contentFields: BroadcastContent;

  constructor(public activeModal: NgbActiveModal,
              private router: Router,
              private broadcastService: BroadcastService,
              private alertService: AlertService,) { }

  ngOnInit() {
    this.confirmFields = this.broadcastService.getConfirmationFields();
    console.log("confirmation fields: ", this.confirmFields);
    this.contentFields = this.broadcastService.getContent();
  }

  edit() {
    console.log("edit clicked!");
    this.activeModal.dismiss('Edit clicked');
    this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'content']);
  }

  confirm() {
    console.log("okay, here goes ...");
    this.broadcastService.sendBroadcast().subscribe(result => {
      console.log("it worked! result: ", result);
      this.broadcastService.clearBroadcast();
      this.activeModal.dismiss('Broadcast sent!');
      this.alertService.alert('broadcasts.create.sent.' + this.confirmFields.sendTimeDescription, true);
      this.router.navigate(['/home']); // should send to wherever we came from
    }, error => {
      console.log("it failed! result: ", error);
    })
  }

}
