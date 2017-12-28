import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
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

  constructor(private router: Router, private formBuilder: FormBuilder, private broadcastService: BroadcastService) {
    this.typesForm = this.formBuilder.group(new BroadcastTypes(), {validator: oneItemSelected});
  }

  ngOnInit() {
    this.typesForm.setValue(this.broadcastService.getTypes());
  }

  saveTypes(): boolean {
    if (!this.typesForm.valid) {
      return false;
    }
    this.broadcastService.setTypes(this.typesForm.value);
    return true;
  }

  next() {
    if (this.saveTypes()) {
      this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(),
        this.broadcastService.parentId(), 'content'])
    }
  }

  cancel() {
    this.router.navigate([this.broadcastService.cancelRoute()]);
  }

}

export const oneItemSelected = (form: FormGroup) => {
  let countSelected = 0;
  Object.keys(form.controls).forEach(key => {
    if (form.get(key).value == true) {
      countSelected++;
    }
  });
  if (countSelected == 0) {
    return { valid : false};
  }
  return null;
};
