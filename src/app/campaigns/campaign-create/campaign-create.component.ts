import {Component, OnInit} from '@angular/core';
import {CampaignService} from "../campaign.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DateTimeUtils, epochMillisFromDate} from "../../utils/DateTimeUtils";
import {optionalUrlValidator} from "../../validators/CustomValidators";
import {CampaignRequest} from "./campaign-request";
import {GroupService} from "../../groups/group.service";
import {GroupInfo} from "../../groups/model/group-info.model";
import {AlertService} from "../../utils/alert-service/alert.service";
import {Router} from "@angular/router";
import {
  checkCodeIsNumber,
  hasChosenGroupIfNeeded,
  hasGroupNameIfNeeded,
  hasValidLandingUrlIfNeeded, smsLimitAboveZero, ValidateCodeNotTaken
} from "../utils/campaign-validators";
import {UserService} from "../../user/user.service";

declare var $: any;

@Component({
  selector: 'app-campaign-create',
  templateUrl: './campaign-create.component.html',
  styleUrls: ['./campaign-create.component.css']
})
export class CampaignCreateComponent implements OnInit {

  public canCreateCampaign: boolean = false;

  public createCampaignForm: FormGroup;
  public dragAreaClass: string = "dragarea";

  public takenCodes: string[] = [];
  public availableGroups: GroupInfo[] = [];
  public possibleTopics: string[] = [];

  private selectedTopics: string[] = []; // select 2 and form control don't seem to play nice together, hence

  constructor(private campaignService: CampaignService,
              private groupService: GroupService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private router: Router,
              private alertService: AlertService) {

    this.createCampaignForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      'code': ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3),
        checkCodeIsNumber]), ValidateCodeNotTaken.createValidator(this.campaignService)],
      'startDate': [DateTimeUtils.nowAsDateStruct(), Validators.required],
      'endDate': [DateTimeUtils.futureDateStruct(3, 0), Validators.required],
      'type': ['', Validators.required],
      'groupType': ['', Validators.required],
      'groupUid': ['', hasChosenGroupIfNeeded],
      'groupName': ['', hasGroupNameIfNeeded],
      'amandlaUrl': ['', optionalUrlValidator],
      'smsShare': ['false'],
      'smsLimit': [0, smsLimitAboveZero],
      'landingPage': ['GRASSROOT'],
      'landingUrl': ['', hasValidLandingUrlIfNeeded]
    }, { validate: 'onBlur' });

    this.canCreateCampaign = this.userService.getLoggedInUser().hasAccountAdmin();

  }

  ngOnInit() {
    this.campaignService.fetchActiveCampaignCodes().subscribe(result => {
      this.takenCodes = result
    }, error => {
      console.log("error fetching codes: ", error);
    });
    this.groupService.groupInfoList.subscribe(result => this.loadGroupSelector(result));
    this.alertService.hideLoadingDelayed();
    this.setUpTopicSelector();
  }

  loadGroupSelector(groups: GroupInfo[]) {
    this.availableGroups = groups.filter(group => group.hasPermission("GROUP_PERMISSION_CREATE_CAMPAIGN"));
    this.createCampaignForm.controls['groupUid'].valueChanges.subscribe(value => {
      console.log("selected this group: ", value);
      let selectedGroupTopics = this.availableGroups.find(grp => grp.groupUid === value).topics;
      if (selectedGroupTopics) {
        this.possibleTopics = selectedGroupTopics;
        console.log("possible topics now  = ", this.possibleTopics);
        // this.setUpTopicSelector();
      }
    });
  }

  checkCodeAvailability(control: FormControl) {
    let code = control.value;
    if (this.takenCodes.includes("" + code)) {
      return { codeTaken: true }
    }
    return null;
  }

  setUpTopicSelector() {
    let component = $("#join-topic-select");
    component.select2({
      placeholder: "Topics user will be asked to select after signing, joining or engaging",
      tags: true,
      allowClear: true,
    });

    component.on('change.select2', function () {
      const data = component.select2('data');
      this.selectedTopics = data.length > 0 ? data.map(tt => tt.id) : [];
    }.bind(this));

  }

  createCampaign() {
    if (!this.createCampaignForm.valid) {
      Object.keys(this.createCampaignForm.controls)
        .filter(field => this.createCampaignForm.controls[field].errors)
        .map(field => {
          this.createCampaignForm.controls[field].markAsTouched( {onlySelf: true });
          console.log(field + ": ", this.createCampaignForm.controls[field].errors)
        });
      return false;
    }

    console.log("constructed form: ", this.getRequestFromForm());
    this.alertService.showLoading();
    this.campaignService.createCampaign(this.getRequestFromForm()).subscribe(result => {
      this.alertService.alert("campaign.create.complete.success");
      this.alertService.hideLoading();
      this.router.navigate(['/campaign/' + result.campaignUid + '/messages']);
    }, error2 => {
      // todo : proper error messages
      console.log("error creating campaign! : ", error2);
      this.alertService.hideLoading();
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

    request.joinTopics = this.selectedTopics;

    return request;
  }

  uploadCampaignImage(event) {

  }

}
