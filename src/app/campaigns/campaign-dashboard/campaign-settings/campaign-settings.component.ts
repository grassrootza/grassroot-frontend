import {Component, OnInit} from '@angular/core';
import {CampaignInfo} from "../../model/campaign-info";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {
  hasChosenGroupIfNeeded,
  hasGroupNameIfNeeded,
  hasValidLandingUrlIfNeeded
} from "../../campaign-create/campaign-create.component";
import {DateTimeUtils} from "../../../utils/DateTimeUtils";
import {optionalUrlValidator} from "../../../utils/CustomValidators";
import {CampaignService} from "../../campaign.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-campaign-settings',
  templateUrl: './campaign-settings.component.html',
  styleUrls: ['./campaign-settings.component.css']
})
export class CampaignSettingsComponent implements OnInit {

  campaign: CampaignInfo;
  public campaignSettingsForm: FormGroup;

  constructor(private campaignService: CampaignService,
              private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.parent.params.subscribe(params => {
      let campaignUid = params['id'];
      this.campaignService.loadCampaign(campaignUid).subscribe(campaign => {
        this.campaign = campaign;
        this.setUpForm();
      });
    });
  }

  setUpForm() {
    this.campaignSettingsForm = this.fb.group({
      'name': [this.campaign.name, Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': [this.campaign.description, Validators.compose([Validators.required, Validators.minLength(10)])],
      // 'code': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3),
      //   checkCodeIsNumber, this.checkCodeAvailability.bind(this)])],
      'startDate': [DateTimeUtils.nowAsDateStruct(), Validators.required],
      'endDate': [DateTimeUtils.futureDateStruct(3, 0), Validators.required],
      'type': [this.campaign.campaignType, Validators.required],
      'groupType': ['', Validators.required],
      'groupUid': ['', hasChosenGroupIfNeeded],
      'groupName': ['', hasGroupNameIfNeeded],
      'amandlaUrl': ['', optionalUrlValidator],
      'smsShare': [this.campaign.smsSharingEnabled],
      'smsLimit': [this.campaign.smsSharingBudget],
      'landingPage': ['GRASSROOT'],
      'landingUrl': ['', hasValidLandingUrlIfNeeded]
    }, { validate: 'onBlur' });

    this.campaignSettingsForm.controls['type'].valueChanges.subscribe(value => this.alterCampaignType(value))
  }

  alterCampaignType(newType: string) {
    console.log("selected: ", newType);
    this.campaignService.updateCampaignType(this.campaign.campaignUid, newType).subscribe(result => {
      console.log("done!: ", result);
    }, error => {
      console.log("nope, error: ", error);
    })
  }

}
