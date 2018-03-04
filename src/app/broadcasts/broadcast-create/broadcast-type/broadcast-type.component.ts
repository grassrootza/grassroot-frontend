import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {BroadcastService} from "../../broadcast.service";
import {BroadcastTypes} from "../../model/broadcast-request";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BroadcastParams} from "../../model/broadcast-params";

@Component({
  selector: 'app-broadcast-type',
  templateUrl: './broadcast-type.component.html',
  styleUrls: ['./broadcast-type.component.css', '../broadcast-create.component.css']
})
export class BroadcastTypeComponent implements OnInit {

  public typesForm: FormGroup;
  public createParams: BroadcastParams = new BroadcastParams();
  public costThisMonth: number = 0;

  constructor(private router: Router, private formBuilder: FormBuilder, private broadcastService: BroadcastService) {
    this.typesForm = this.formBuilder.group(new BroadcastTypes(), {validator: Validators.compose([oneItemSelected, fbPageSelectedIfFb])});
  }

  ngOnInit() {
    this.typesForm.setValue(this.broadcastService.getTypes());
    this.broadcastService.createParams.subscribe(createParams => {
      console.log("create params received: ", this.createParams);
      this.createParams = createParams;
    });

    this.broadcastService.getCostThisMonth().subscribe(resp => {
      this.costThisMonth = resp/100;
    })
  }

  saveTypes(): boolean {
    if (!this.typesForm.valid) {
      return false;
    }
    if (this.typesForm.get('twitter').value && this.createParams.twitterAccount) {
      this.typesForm.get("twitterAccount").reset(this.createParams.twitterAccount.displayName);
    }
    if (this.typesForm.get('facebook').value && this.createParams.facebookPages) {
      let fbPage = this.typesForm.get("facebookPages").value;
      if (!(fbPage) || fbPage == "") {
        console.log("settting fb page to default");
        this.typesForm.get("facebookPages").reset(this.createParams.facebookPages[0].providerUserId);
      }
    }
    console.log("form values: ", this.typesForm.value);
    this.broadcastService.setTypes(this.typesForm.value);
    return true;
  }

  next() {
    if (this.saveTypes()) {
      this.broadcastService.setPageCompleted('types');
      this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(),
        this.broadcastService.parentId(), 'content']);
    }
  }

  cancel() {
    this.broadcastService.cancelCurrentCreate();
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

export const fbPageSelectedIfFb = (form: FormGroup) => {
  let fbCheck = form.get('facebook');
  if (fbCheck && fbCheck.value === true) {
    return Validators.required(form.get('facebookPages'))
  }
  return null;
};
