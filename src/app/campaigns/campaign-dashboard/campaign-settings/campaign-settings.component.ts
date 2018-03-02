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
import {MediaFunction} from "../../../media/media-function.enum";
import {MediaService} from "../../../media/media.service";
import {ValidateCodeNotTaken} from "../../utils/validate-code-not-taken";

@Component({
  selector: 'app-campaign-settings',
  templateUrl: './campaign-settings.component.html',
  styleUrls: ['./campaign-settings.component.css']
})
export class CampaignSettingsComponent implements OnInit {

  campaign: CampaignInfo;
  campaignImageUrl: string;
  public campaignSettingsForm: FormGroup;

  public extendingCampaign: boolean = false;
  public needsNewCode: boolean = false;

  constructor(private campaignService: CampaignService, private mediaService: MediaService,
              private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.parent.params.subscribe(params => {
      let campaignUid = params['id'];
      this.campaignService.loadCampaign(campaignUid).subscribe(campaign => {
        this.campaign = campaign;
        if (this.campaign.campaignImageKey) {
          this.campaignImageUrl = this.mediaService.getImageUrl(MediaFunction.CAMPAIGN_IMAGE, this.campaign.campaignImageKey);
        }
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
      'endDate': [DateTimeUtils.futureDateStruct(3, 0), Validators.required],
      'newCode': [this.campaign.campaignCode, [], ValidateCodeNotTaken.createValidator(this.campaignService)],
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

    this.campaignSettingsForm.controls['type'].valueChanges.subscribe(value => this.alterCampaignType(value));
    // would be more elegant as an async validator, but for now
    // this.campaignSettingsForm.controls['newCode'].valueChanges.debounceTime(300)
    //   .subscribe(value => this.checkCodeAvailability(value, 'newCode'));
  }

  alterCampaignType(newType: string) {
    console.log("selected: ", newType);
    this.campaignService.updateCampaignType(this.campaign.campaignUid, newType).subscribe(result => {
      console.log("done!: ", result);
    }, error => {
      console.log("nope, error: ", error);
    })
  }

  alterCampaignImage(event) {
    let images = event.target.files;
    if (images.length > 0) {
      this.mediaService.uploadMedia(images[0], MediaFunction.CAMPAIGN_IMAGE).subscribe(imageKey => {
        this.campaign.campaignImageKey = imageKey;
        this.campaignImageUrl = this.mediaService.getImageUrl(MediaFunction.CAMPAIGN_IMAGE, imageKey);
        console.log("image url now = ", this.campaignImageUrl);
        this.campaignService.updateCampaignImage(this.campaign.campaignUid, imageKey).subscribe();
      }, error => {
        console.log("error uploading image!: ", error);
      });
    }
  }

  alterEndDate() {
    this.extendingCampaign = true;
    if (!this.campaign.isActive()) {
      this.handleNeedingNewCode();
    }
  }

  handleNeedingNewCode() {
    this.campaignService.checkCodeAvailability(this.campaign.campaignCode).subscribe(result => {
      this.needsNewCode = result;
    });
  }

}
