import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {BroadcastService} from "../../broadcast.service";
import {Router} from "@angular/router";
import {BroadcastSchedule} from "../../model/broadcast-request";
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BroadcastConfirmComponent} from "../broadcast-confirm/broadcast-confirm.component";
import {DateTimeUtils} from "../../../utils/DateTimeUtils";

@Component({
  selector: 'app-broadcast-schedule',
  templateUrl: './broadcast-schedule.component.html',
  styleUrls: ['./broadcast-schedule.component.css', '../broadcast-create.component.css']
})
export class BroadcastScheduleComponent implements OnInit {

  scheduleForm: FormGroup;

  constructor(private broadcastService: BroadcastService, private formBuilder: FormBuilder,
              private modalService: NgbModal, private router: Router) {
    this.scheduleForm = formBuilder.group(new BroadcastSchedule());
  }

  ngOnInit() {
    this.scheduleForm.setValue(this.broadcastService.getSchedule())
  }

  next() {
    if (!this.scheduleForm.valid) {
      return;
    }
    this.storeSchedule();
    this.broadcastService.setPageCompleted('schedule');
    console.log("about to open modal ...");
    this.modalService.open(BroadcastConfirmComponent).result.then((result) => {
      console.log("closed with result", result);
    }, (reason) => {
      console.log("dismissed with reason ", reason);
    });
  }

  back() {
    this.storeSchedule();
    this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'members']);
  }

  storeSchedule() {
    let entity: BroadcastSchedule = this.scheduleForm.value;
    console.log("entity: ", entity);
    if (entity.sendType == 'FUTURE') {
      entity.sendMoment = DateTimeUtils.momentFromNgbStruct(entity.dateEpochMillis, entity.timeEpochMillis);
      entity.sendDateString = entity.sendMoment.format("h:mm a [on] dddd, MMMM Do YYYY");
      entity.sendDateTimeMillis = entity.sendMoment.valueOf();
    }
    console.log("well, this is the entity: ", entity);
    this.broadcastService.setSchedule(entity);
  }

  cancel() {
    console.log("cancelling");
    this.broadcastService.cancelCurrentCreate();
  }

}
