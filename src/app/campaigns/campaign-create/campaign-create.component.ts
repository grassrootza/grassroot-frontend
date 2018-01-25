import {Component, OnInit} from '@angular/core';
import {CampaignService} from "../campaign.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";
import {DateTimeUtils, epochMillisFromDate} from "../../utils/DateTimeUtils";
import {optionalUrlValidator, urlValidator} from "../../utils/CustomValidators";
import {CampaignRequest} from "./campaign-request";

@Component({
  selector: 'app-campaign-create',
  templateUrl: './campaign-create.component.html',
  styleUrls: ['./campaign-create.component.css']
})
export class CampaignCreateComponent implements OnInit {

  public createCampaignForm: FormGroup;
  public dragAreaClass: string = "dragarea";

  constructor(private campaignService: CampaignService, private formBuilder: FormBuilder,
              private spinnerService: Ng4LoadingSpinnerService) {

    this.createCampaignForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'code': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3)])],
      'startDate': [DateTimeUtils.nowAsDateStruct(), Validators.required],
      'endDate': [DateTimeUtils.futureDateStruct(3, 0), Validators.required],
      'type': ['', Validators.required],
      'groupType': ['', Validators.required],
      'groupUid': [''],
      'groupName': ['', hasGroupNameIfNeeded],
      'amandlaUrl': ['', optionalUrlValidator],
      'smsShare': ['false'],
      'smsLimit': [0],
      'landingPage': ['GRASSROOT'],
      'landingUrl': ['', hasValidLandingUrlIfNeeded]
    }, { validate: 'onBlur' });
  }

  ngOnInit() {

  }

  createCampaign() {
    if (!this.createCampaignForm.valid) {
      Object.keys(this.createCampaignForm.controls)
        .filter(field => this.createCampaignForm.controls[field].errors)
        .map(field => console.log(field + ": ", this.createCampaignForm.controls[field].errors));
      return false;
    }

    this.campaignService.createCampaign(this.getRequestFromForm()).subscribe(result => {
      console.log("well that worked");
    }, error2 => {
      console.log("error creating campaign! : ", error2);
    });
  }

  getRequestFromForm(): CampaignRequest {
    let request = new CampaignRequest();
    request.name = this.createCampaignForm.controls.name.value;
    request.code = this.createCampaignForm.controls.code.value;
    request.description = this.createCampaignForm.controls.description.value;
    request.type = this.createCampaignForm.controls.type.value;

    request.startDateEpochMillis = epochMillisFromDate(this.createCampaignForm.controls.startDate.value);
    request.endDateEpochMillis = epochMillisFromDate(this.createCampaignForm.controls.endDate.value);

    request.smsShare = this.createCampaignForm.controls.smsShare.value;
    if (request.smsShare) {
      request.smsLimit = this.createCampaignForm.controls.smsLimit.value;
    }

    request.landingPage = this.createCampaignForm.controls.landingPage.value;
    if (request.landingPage == 'OTHER') {
      request.landingUrl = this.createCampaignForm.controls.landingUrl.value;
    }

    if (this.createCampaignForm.controls.amandlaUrl.value) {
      request.amandlaUrl = this.createCampaignForm.controls.amandlaUrl.value;
    }

    if (this.createCampaignForm.controls.groupType.value == 'EXISTING') {
      request.groupUid = this.createCampaignForm.controls.groupUid.value;
    } else {
      request.groupName = this.createCampaignForm.controls.groupName.value;
    }

    console.log("and, here is our campaign request: ", request);

    return request;
  }

  uploadCampaignImage(event) {

  }

}

export const hasGroupNameIfNeeded = (input: FormControl) => {
  if (!input.root) {
    return null;
  }

  if (input.root.get('groupType') && input.root.get('groupType').value == 'NEW') {
    return Validators.required(input);
  }

  return null;
};

export const hasValidLandingUrlIfNeeded = (input: FormControl) => {
  if (!input.root || !(input.root.get('landingPage'))) {
    return null;
  }

  if (input.root.get('landingPage') && input.root.get('landingPage').value == 'OTHER') {
    return urlValidator(input);
  }

  return null;
};
