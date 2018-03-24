import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BroadcastService} from "../../broadcast.service";
import {Router} from "@angular/router";
import {BroadcastConfirmation, BroadcastContent} from "../../model/broadcast-request";
import {AlertService} from "../../../utils/alert.service";
import {emailStyleHeader} from "../../../utils/media-utils";

@Component({
  selector: 'app-broadcast-confirm',
  templateUrl: './broadcast-confirm.component.html',
  styleUrls: ['./broadcast-confirm.component.css', '../broadcast-create.component.css']
})
export class BroadcastConfirmComponent implements OnInit {

  public confirmFields: BroadcastConfirmation;
  public contentFields: BroadcastContent;
  public strippedEmailContent: string;

  constructor(public activeModal: NgbActiveModal,
              private router: Router,
              private broadcastService: BroadcastService,
              private alertService: AlertService,) { }

  ngOnInit() {
    this.confirmFields = this.broadcastService.getConfirmationFields();
    console.log("confirmation fields: ", this.confirmFields);
    this.contentFields = this.broadcastService.getContent();
    if (this.contentFields.emailContent) {
      this.strippedEmailContent = this.contentFields.emailContent.replace(emailStyleHeader, '');
    }
  }

  edit() {
    this.activeModal.dismiss('Edit clicked');
    this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'content']);
  }

  confirm() {
    console.log("create request = ", this.broadcastService.createRequest);
    this.alertService.showLoading();
    this.broadcastService.sendBroadcast().subscribe(result => {
      let redirectRoute = this.broadcastService.parentViewRoute();
      this.broadcastService.clearBroadcast();
      this.activeModal.dismiss('Broadcast sent!');
      this.alertService.hideLoading();
      this.alertService.alert('broadcasts.create.sent.' + this.confirmFields.sendTimeDescription, true);
      // maybe consider storing prior URL (though seems a non-trivial thing), but for now just go to view of parent
      this.router.navigate([redirectRoute]);
    }, error => {
      console.log("it failed! result: ", error);
    })
  }

}
