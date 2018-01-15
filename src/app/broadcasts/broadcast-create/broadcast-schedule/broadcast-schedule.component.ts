import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {BroadcastService} from "../../broadcast.service";
import {Router} from "@angular/router";
import {BroadcastSchedule} from "../../model/broadcast-request";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BroadcastConfirmComponent} from "../broadcast-confirm/broadcast-confirm.component";

@Component({
  selector: 'app-broadcast-schedule',
  templateUrl: './broadcast-schedule.component.html',
  styleUrls: ['./broadcast-schedule.component.css', '../broadcast-create.component.css']
})
export class BroadcastScheduleComponent implements OnInit {

  scheduleForm: FormGroup;
  confirmationForm: FormGroup; // for modal prior to sending

  constructor(private broadcastService: BroadcastService, private formBuilder: FormBuilder,
              private modalService: NgbModal, private router: Router) {
    this.scheduleForm = formBuilder.group(new BroadcastSchedule());
    this.confirmationForm = formBuilder.group({
      'smsContent': '',
      'emailContent': '',
      'facebookContent': '',
      'twitterContent': ''
    });
  }

  ngOnInit() {
    this.scheduleForm.setValue(this.broadcastService.getSchedule())
  }

  next() {
    console.log("checking if schedule form is valid");
    if (!this.scheduleForm.valid) {
      return;
    }
    this.broadcastService.setSchedule(this.scheduleForm.value);
    this.broadcastService.setPageCompleted('schedule');
    // this.confirmationForm.setValue(this.broadcastService.getConfirmationFields());
    console.log("about to open modal ...");
    this.modalService.open(BroadcastConfirmComponent).result.then((result) => {
      console.log("closed with result", result);
    }, (reason) => {
      console.log("dismissed with reason ", reason);
    });
  }

  back() {
    this.broadcastService.setSchedule(this.scheduleForm.value);
    this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'members']);
  }

  cancel() {
    this.broadcastService.cancelCurrentCreate();
  }

}
