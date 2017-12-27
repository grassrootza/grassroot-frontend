import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BroadcastService} from "../../broadcast.service";
import {BroadcastTypes} from "../../model/broadcast-request";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-broadcast-type',
  templateUrl: './broadcast-type.component.html',
  styleUrls: ['./broadcast-type.component.css']
})
export class BroadcastTypeComponent implements OnInit {

  public typesForm: FormGroup;

  // todo : validate at least one type is selected, and load various page details via service
  constructor(private router: Router, private formBuilder: FormBuilder, private broadcastService: BroadcastService) {
    this.typesForm = formBuilder.group(new BroadcastTypes());
  }

  ngOnInit() {
    this.typesForm.setValue(this.broadcastService.getTypes());
  }

  // todo: probably better to do this using Rx, but given time pressure, doing this way for now
  saveTypes(): boolean {
    if (!this.typesForm.valid) {
      return false;
    }
    this.broadcastService.setTypes(this.typesForm.value);
    return true;
  }

  goToNext() {
    if (this.saveTypes()) {
      this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(),
        this.broadcastService.parentId(), 'content'])
    }
  }

  cancel() {
    this.router.navigate([this.broadcastService.cancelRoute()]);
  }

}
