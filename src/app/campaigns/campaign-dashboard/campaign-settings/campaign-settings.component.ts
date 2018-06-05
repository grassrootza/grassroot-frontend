import {Component, OnInit} from '@angular/core';
import {CampaignInfo} from "../../model/campaign-info";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DateTimeUtils, ngbDateFromMoment} from "../../../utils/DateTimeUtils";
import {optionalUrlValidator} from "../../../validators/CustomValidators";
import {CampaignService} from "../../campaign.service";
import {ActivatedRoute} from "@angular/router";
import {MediaFunction} from "../../../media/media-function.enum";
import {MediaService} from "../../../media/media.service";
import {
  checkCodeIsNumber,
  hasValidLandingUrlIfNeeded,
  smsLimitAboveZero,
  ValidateCodeNotTaken,
  ValidateWordNotTaken
} from "../../utils/campaign-validators";
import {CampaignMsgRequest, CampaignUpdateParams} from "../../campaign-create/campaign-request";
import {AlertService} from "../../../utils/alert-service/alert.service";
import {CurrencyPipe} from "@angular/common";
import {ENGLISH, Language} from "../../../utils/language";
import * as moment from "moment";
import {GroupService} from "../../../groups/group.service";
import {GroupInfo} from "../../../groups/model/group-info.model";

declare var $: any;

@Component({
  selector: 'app-campaign-settings',
  templateUrl: './campaign-settings.component.html',
  styleUrls: ['./campaign-settings.component.css']
})
export class CampaignSettingsComponent implements OnInit {

  campaign: CampaignInfo;

  campaignImageUrl: string;
  newCampaignImageKey: string;
  removeImage: boolean; // need strict separation from key being = "", given fragility of various forms of param checking etc

  revisedTopics: string[];

  public campaignSettingsForm: FormGroup;

  public extendingCampaign: boolean = false;
  public needsNewCode: boolean = false;

  public changingGroup: boolean = false;
  public availableGroups: GroupInfo[] = [];

  public changingType: boolean = false;
  public availableTypes: string[] = ['ACQUISITION', 'PETITION', 'INFORMATION'];

  public changingSharing: boolean = false;
  public smsBudget = "0";
  public smsSpent = "0";
  public changedSharingBudget: boolean = false;

  public campaignLanguages: Language[];
  public sharingMessages: CampaignMsgRequest[] = [];
  public sharingMsgsComplete: boolean = false;

  constructor(private campaignService: CampaignService,
              private mediaService: MediaService,
              private alertService: AlertService,
              private groupService: GroupService,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private currencyPipe: CurrencyPipe) {
    this.campaignSettingsForm = this.fb.group({});
  }

  ngOnInit() {
    // this.setUpTopicSelector();
    this.route.parent.params.subscribe(params => {
      let campaignUid = params['id'];
      this.campaignService.loadCampaign(campaignUid).subscribe(campaign => {
        this.campaign = campaign;
        if (this.campaign.campaignImageKey) {
          this.campaignImageUrl = this.mediaService.getImageUrl(MediaFunction.CAMPAIGN_IMAGE, this.campaign.campaignImageKey);
        }
        this.campaignLanguages = this.campaign.getLanguages();
        if (!this.campaignLanguages || this.campaignLanguages.length == 0) {
          this.campaignLanguages = [ENGLISH];
        }
        if (this.campaign.outboundSmsEnabled) {
          this.smsSpent = this.currencyPipe.transform(this.campaign.outboundSmsSpent, "ZAR", "symbol-narrow");
          this.calculateSmsBudget(this.campaign.outboundSmsLimit);
        } else {
          this.calculateSmsBudget(0); // in case switched on
        }
        this.setUpForm();
        setTimeout(() => this.setUpTopicSelector(), 300); // otherwise component may not be initialized and this will fail
      });
    });
  }

  setUpForm() {
    this.campaignSettingsForm = this.fb.group({
      'name': [this.campaign.name, Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': [this.campaign.description, Validators.compose([Validators.required, Validators.minLength(10)])],
      'code': [this.campaign.campaignCode, [], ValidateCodeNotTaken.createValidator(this.campaignService, this.campaign.campaignUid),
        Validators.minLength(3), Validators.maxLength(3), checkCodeIsNumber],
      'textWord': [this.campaign.textJoinWord, [], ValidateWordNotTaken.createValidator(this.campaignService, this.campaign.campaignUid)],
      'endDate': [{value: ngbDateFromMoment(this.campaign.campaignEndDate), disabled: true}, Validators.required],
      'campaignType': [this.campaign.campaignType],
      'masterGroup': [''],
      'smsShare': [{value: this.campaign.outboundSmsEnabled.toString(), disabled: true}],
      'smsLimit': [this.campaign.outboundSmsLimit, smsLimitAboveZero],
      'amandlaUrl': ['', optionalUrlValidator],
      'landingPage': [this.landingPageType()],
      'landingUrl': [this.campaign.campaignUrl, hasValidLandingUrlIfNeeded]
    }, { validate: 'onBlur' });

    this.campaignSettingsForm.controls['smsLimit'].valueChanges.subscribe(value => {
      this.calculateSmsBudget(value);
      this.changedSharingBudget = true;
    });
    this.groupService.groupInfoList.subscribe(groups => {
      this.availableGroups = groups.filter(group => group.hasPermission("GROUP_PERMISSION_CREATE_CAMPAIGN"));
    });
  }

  landingPageType(): string {
    return !this.campaign.campaignUrl ? "GRASSROOT" :
      this.campaign.campaignUrl == this.campaign.petitionUrl ? "AMANDLA" : "OTHER";
  }

  setUpTopicSelector() {
    let component = $("#join-topic-change-select");
    component.select2({
      placeholder: "Topics user will be asked to select after signing, joining or engaging",
      tags: true
    });

    component.on('change.select2', function () {
      const data = component.select2('data');
      this.revisedTopics = data.length > 0 ? data.map(tt => tt.id) : [];
    }.bind(this));

  }

  alterCampaignImage(event) {
    let images = event.target.files;
    if (images.length > 0) {
      this.alertService.showLoading();
      this.mediaService.uploadMedia(images[0], MediaFunction.CAMPAIGN_IMAGE).subscribe(imageKey => {
        this.newCampaignImageKey = imageKey;
        this.campaignImageUrl = this.mediaService.getImageUrl(MediaFunction.CAMPAIGN_IMAGE, imageKey);
        this.alertService.hideLoading();
      }, error => {
        this.alertService.hideLoading();
        console.log("error uploading image!: ", error);
      });
    }
  }

  removeCampaignImage() {
    this.campaignImageUrl = "";
    this.removeImage = true;
    return false;
  }

  alterEndDate() {
    this.extendingCampaign = true;
    this.campaignSettingsForm.controls['endDate'].enable({onlySelf: true});
    if (!this.campaign.isActive()) {
      this.campaignService.checkCodeAvailability(this.campaign.campaignCode).subscribe(result => {
        this.needsNewCode = !result;
      });
    }
    return false;
  }

  alterCampaignType() {
    $("#change-type-warning-modal").modal("show");
    this.changingType = true;
  }

  // as with end date, this is sensitive, so making entirely sure user wants to do it before opening it up
  alterSmsShare() {
    this.changingSharing = true;
    this.campaignSettingsForm.controls['smsShare'].enable({onlySelf: true});
    console.log("campaign languages: ", this.campaign.getLanguages());
    console.log("campaign validation: ", this.campaignSettingsForm.controls['smsLimit'].errors);
    this.campaignSettingsForm.controls['smsShare'].valueChanges.subscribe(value => {
      if (value == 'true' && !this.campaign.outboundSmsEnabled && !this.campaign.hasMessageType('SHARE_PROMPT')) {
        let messageIdBase = "message_" + moment().valueOf() + "_";
        this.sharingMessages.push(new CampaignMsgRequest(messageIdBase + "1", "SHARE_PROMPT"));
        this.sharingMessages.push(new CampaignMsgRequest(messageIdBase + "2", "SHARE_SEND"));
        $("#sharing-messages-modal").modal('show');
      }
    });
    return false;
  }

  calculateSmsBudget(numberSms: number) {
    console.log(`number SMS: ${numberSms}, outbound unit cost: ${this.campaign.outboundSmsUnitCost}`);
    this.smsBudget = this.currencyPipe.transform(numberSms * this.campaign.outboundSmsUnitCost / 100, "ZAR", "symbol-narrow");
  }

  updateCampaign() {
    let params: CampaignUpdateParams = {};

    let textFields = ['name', 'code', 'textWord', 'description', 'amandlaUrl', 'landingUrl'];
    textFields.filter(field => this.campaignSettingsForm.controls[field].dirty)
      .forEach(field => params[field] = this.campaignSettingsForm.controls[field].value);

    let moment = DateTimeUtils.momentFromNgbStruct(this.campaignSettingsForm.controls['endDate'].value);
    let changedDate = this.extendingCampaign && moment.unix() > 0 && moment != this.campaign.campaignEndDate;
    if (changedDate && (this.campaign.isActive() || !this.needsNewCode)) {
      params.endDateMillis = moment.valueOf();
    } else if (changedDate && this.extendingCampaign && this.campaignSettingsForm.controls['newCode'].valid) { // so campaign must be disabled and require new code
      params.endDateMillis = moment.valueOf();
      params.newCode = this.campaignSettingsForm.controls['newCode'].value;
    }

    if (this.changingType && this.campaignSettingsForm.controls['campaignType'].value != this.campaign.campaignType) {
      params.campaignType = this.campaignSettingsForm.controls['campaignType'].value;
    }

    if (this.changingGroup && this.campaignSettingsForm.controls['masterGroup'].value != this.campaign.masterGroupUid) {
      params.newMasterGroupUid = this.campaignSettingsForm.controls['masterGroup'].value;
    }

    if (this.revisedTopics && (this.revisedTopics.length != this.campaign.joinTopics.length ||
      this.revisedTopics.every((v, i) => v == this.campaign.joinTopics[i]))) {
      params.joinTopics = this.revisedTopics;
    }

    if (this.newCampaignImageKey) {
      params.mediaFileUid = this.newCampaignImageKey;
    }

    if (this.removeImage)
      params.removeImage = this.removeImage;

    console.log("updating campaign, params: ", params);

    const changedBasics = Object.keys(params).length > 0;
    let changedSharing = (this.changingSharing && this.campaignSettingsForm.controls['smsShare'].value != this.campaign.outboundSmsEnabled.toString()) 
      || this.changedSharingBudget;
    // console.log("changing sharing? : ", changedSharing);

    if (changedBasics) {
      this.updateBasicSettings(params, changedSharing);
    } else if (changedSharing) {
      this.alterCampaignSharing();
    }
  }

  updateBasicSettings(params: CampaignUpdateParams, changedSharing: boolean) {
    this.alertService.showLoading();
    this.campaignService.changeCampaignSettings(this.campaign.campaignUid, params).subscribe(changedCampaign => {
      this.campaign = changedCampaign;
      if (changedSharing || this.changedSharingBudget) {
        this.alterCampaignSharing();
      } else {
        this.cleanUpAndReset(changedCampaign);
      }
    }, error => {
      this.alertService.hideLoading();
      console.log("Error updating campaign! : ", error);
    });
  }

  alterCampaignSharing() {
    const sharingEnabled = (this.campaignSettingsForm.controls['smsShare'].value == 'true');
    const sharingLimit = +this.campaignSettingsForm.controls['smsLimit'].value;
    this.alertService.showLoading();
    this.campaignService.changeCampaignSharing(this.campaign.campaignUid, sharingEnabled, sharingLimit, this.sharingMessages)
      .subscribe(revisedCampaign => {
        this.cleanUpAndReset(revisedCampaign);
      }, error => {
        console.log("error changing sharing: ", error);
        this.alertService.hideLoading();
      });
  }

  storeSharingMessages(event, type) {
    this.sharingMessages.find(msg => msg.linkedActionType == type).messages = event as Map<string, string>;
    console.log("sharing messages: ", this.sharingMessages);
    this.sharingMsgsComplete = this.sharingMessages.every(msg => msg.messagesComplete(this.campaignLanguages));
  }

  cancelSharingMessages() {
    this.campaignSettingsForm.controls['smsShare'].setValue('false', {onlySelf: true});
    $("#sharing-messages-modal").modal('hide');
    console.log("value of radio button: ", this.campaignSettingsForm.controls['smsShare']);
    return false;
  }

  cleanUpAndReset(revisedCampaign: CampaignInfo) {
    this.campaign = revisedCampaign;
    console.log("received revised campaign: ", revisedCampaign);
    this.alertService.hideLoading();
    this.alertService.alert("campaign.settings.done");
    this.extendingCampaign = false;
    this.changingType = false;
    this.changingGroup = false;
    this.changingSharing = false;
    this.campaignSettingsForm.reset({onlySelf: true});
    this.calculateSmsBudget(this.campaign.outboundSmsLimit);
    this.setUpForm();
  }

  confirmCampaignEnd() {
    $('#confirm-end-modal').modal('show');
  }

  endCampaign() {
    this.alertService.showLoading();
    this.campaignService.endCampaign(this.campaign.campaignUid).subscribe(endedCampaign => {
      this.alertService.hideLoading();
      $('#confirm-end-modal').modal('hide');
      this.alertService.alert('campaign.settings.ended');
      this.cleanUpAndReset(endedCampaign);
    }, error => {
      $('#confirm-end-modal').modal('hide');
      console.log('error ending campaign: ', error);
      this.alertService.hideLoading();
      this.alertService.alert('campaign.settings.end-error');
    })
  }
}
