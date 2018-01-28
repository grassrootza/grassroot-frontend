import {Component, OnInit} from '@angular/core';
import {ENGLISH, Language, MSG_LANGUAGES} from "../../../utils/language";
import {CampaignMsgRequest} from "../../campaign-create/campaign-request";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CampaignService} from "../../campaign.service";
import {AlertService} from "../../../utils/alert.service";
import {ActivatedRoute} from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-campaign-messages',
  templateUrl: './campaign-messages.component.html',
  styleUrls: ['./campaign-messages.component.css']
})
export class CampaignMessagesComponent implements OnInit {

  public availableLanguages = MSG_LANGUAGES;
  public selectedLanguages: Language[];
  public languageForm: FormGroup;

  private campaignUid: string;
  private _storedMessages: CampaignMsgRequest[];

  constructor(private campaignService: CampaignService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private route: ActivatedRoute) {
    this.selectedLanguages = [ENGLISH]; // start with this as default
    this._storedMessages = [];
  }

  ngOnInit() {
    this.languageForm = this.fb.group({});
    this.availableLanguages.forEach(language => {
      this.languageForm.addControl(language.threeDigitCode,
        this.fb.control(!(this.selectedLanguages.indexOf(language))));
    });
    this.route.parent.params.subscribe(params => this.campaignUid = params['id']);
  }

  updateLanguages() {
    this.selectedLanguages = Object.keys(this.languageForm.value).filter(key => this.languageForm.value[key])
      .map(key => this.getLanguage(key));
    $('#select-language-modal').modal("hide");
  }

  getLanguage(code: string) {
    return this.availableLanguages.find(lang => lang.threeDigitCode == code);
  }

  storeMessages(event: object, actionType: string) {
    if (!this._storedMessages.find(msg => msg.linkedActionType == actionType)) {
      this._storedMessages.push(new CampaignMsgRequest(actionType));
    }
    this._storedMessages.find(msg => msg.linkedActionType == actionType).messages = event as Map<string, string>;
  }

  setMessages() {
    this.campaignService.setCampaignMessages(this.campaignUid, this._storedMessages).subscribe(campaignInfo => {
      this.alertService.alert("campaign.messages.done.success");
    }, error => {
      console.log("well that didn't work: ", error);
      this.alertService.alert("campaign.messages.done.error");
    });
    return false;
  }

}
