import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {BroadcastService} from "../../broadcast.service";
import {Router} from "@angular/router";
import {BroadcastConfirmation, BroadcastContent} from "../../model/broadcast-request";

@Component({
  selector: 'app-broadcast-confirm',
  templateUrl: './broadcast-confirm.component.html',
  styleUrls: ['./broadcast-confirm.component.css']
})
export class BroadcastConfirmComponent implements OnInit {

  public confirmFields: BroadcastConfirmation;
  public contentFields: BroadcastContent;

  constructor(public activeModal: NgbActiveModal, private broadcastService: BroadcastService,
              private router: Router) { }

  ngOnInit() {
    this.confirmFields = this.broadcastService.getConfirmationFields();
    this.contentFields = this.broadcastService.getContent();
  }

  edit() {
    console.log("edit clicked!");
    this.activeModal.dismiss('Edit clicked');
    this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'content']);
  }

  confirm() {
    // submit it and exit
  }

}
