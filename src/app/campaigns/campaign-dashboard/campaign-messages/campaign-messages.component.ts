import {Component, OnInit} from '@angular/core';
import {ENGLISH, Language, MSG_LANGUAGES} from "../../../utils/language";
import {CampaignMsgRequest} from "../../campaign-create/campaign-request";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CampaignService} from "../../campaign.service";
import {AlertService} from "../../../utils/alert-service/alert.service";
import {ActivatedRoute} from "@angular/router";
import * as moment from "moment";
import {CampaignInfo} from "../../model/campaign-info";

declare var $: any;

@Component({
  selector: 'app-campaign-messages',
  templateUrl: './campaign-messages.component.html',
  styleUrls: ['./campaign-messages.component.css']
})
export class CampaignMessagesComponent implements OnInit {

  public campaign: CampaignInfo;

  public messageTypes = {
    'PETITION': ['OPENING', 'MORE_INFO', 'SIGN_PETITION', 'SHARE_PROMPT', 'SHARE_SEND', 'EXIT_POSITIVE', 'EXIT_NEGATIVE'],
    'ACQUISITION': ['OPENING', 'MORE_INFO', 'JOIN_GROUP', 'SHARE_PROMPT', 'SHARE_SEND', 'EXIT_POSITIVE', 'EXIT_NEGATIVE'],
    'INFORMATION': ['OPENING', 'MORE_INFO', 'TAG_ME', 'SHARE_PROMPT', 'EXIT_POSITIVE']
  };

  public messageSequences = {
    'PETITION': {
      'OPENING': ['SIGN_PETITION', 'MORE_INFO'], 'MORE_INFO': ['SIGN_PETITION', 'EXIT_NEGATIVE'], 'SIGN_PETITION': ['name', 'province'],

    },
    'ACQUISITION': {
      'OPENING': ['JOIN_GROUP', 'MORE_INFO'], 'MORE_INFO': ['JOIN_GROUP', 'EXIT_NEGATIVE'], 'JOIN_GROUP': ['name', 'province']
    },
    'INFORMATION': {
      'OPENING': ['TAG_ME', 'MORE_INFO'], 'MORE_INFO': ['TAG_ME', 'EXIT_NEGATIVE']
    }
  };

  public currentTypes: string[] = [];

  private typeIndexes = {};
  private typeMsgIds = {};

  public availableLanguages = MSG_LANGUAGES;
  public selectedLanguages: Language[];
  public languageForm: FormGroup;

  private campaignUid: string;

  // possibly cleaner to use one list, but might get very tricky to manage input changes, flow, etc
  public existingMessages: boolean = false;
  public priorMessages: CampaignMsgRequest[] = [];

  private _currentMessages: CampaignMsgRequest[];

  constructor(private campaignService: CampaignService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private route: ActivatedRoute) {
    this.selectedLanguages = [ENGLISH]; // start with this as default
    this._currentMessages = [];
  }

  ngOnInit() {
    this.languageForm = this.fb.group({});

    this.availableLanguages.forEach(language => {
      this.languageForm.addControl(language.threeDigitCode,
        this.fb.control(!(this.selectedLanguages.indexOf(language))));
    });

    this.route.parent.params.subscribe(params => {
      this.campaignUid = params['id'];
      this.campaignService.loadCampaign(this.campaignUid).subscribe(campaign => {
        this.campaign = campaign;
        this.setUpMessages();
      });
    });
  }

  setUpMessages() {
    this.existingMessages = this.campaign.campaignMessages && this.campaign.campaignMessages.length > 0;
    this.currentTypes = this.messageTypes[this.campaign.campaignType];
    if (!this.campaign.smsSharingEnabled) {
      console.log("slicing out share prompt ...");
      this.sliceOutMessageType('SHARE_PROMPT');
      this.sliceOutMessageType('SHARE_SEND');
    }
    this.currentTypes.forEach((type, index) => {
      this.typeIndexes[type] = index;

      // the message group IDs are only unique within campaign, and only used in set up, so can use timestamp without
      // worrying about matching values if two users doing this for two different campaigns at once
      let existingMsgIndex = this.existingMessages ? this.campaign.campaignMessages.findIndex(msg => msg.linkedActionType === type) : -1;
      let msgId = existingMsgIndex != -1 ? this.campaign.campaignMessages[existingMsgIndex].messageId : "message_" + moment().valueOf() + "_" + index;
      let msgRequest = new CampaignMsgRequest(msgId, type,
        existingMsgIndex != -1 ? this.campaign.campaignMessages[existingMsgIndex].getMessageMap() : new Map<string, string>());

      this.typeMsgIds[type] = msgId;
      this._currentMessages.push(msgRequest);
      this.priorMessages[type] = msgRequest;
    });

    console.log("prior messages: ", this.priorMessages);

    // have to do a quick second loop because msg IDs may not have been set
    this._currentMessages
      .filter(msg => !!this.messageSequences[this.campaign.campaignType][msg.linkedActionType])
      .forEach(msg => {
        console.log("hooking up this message: ", msg);
        msg.nextMsgIds = this.messageSequences[this.campaign.campaignType][msg.linkedActionType]
          .filter(mt => this.typeMsgIds[mt] != undefined)
          .map(mt => this.typeMsgIds[mt]);
        console.log("okay, next IDs: ", msg.nextMsgIds);
    });

  }

  sliceOutMessageType(type: string) {
    let index = this.currentTypes.indexOf(type);
    if (index != -1) {
      this.currentTypes.splice(index, 1);
    }
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
    this._currentMessages.find(msg => msg.linkedActionType == actionType).messages = event as Map<string, string>;
    // console.log("current messages: ", this._currentMessages);
  }

  setMessages() {
    // console.log("okay, trying to save messages: {}", this._currentMessages);
    this.campaignService.setCampaignMessages(this.campaignUid, this._currentMessages).subscribe(campaignInfo => {
      this.alertService.alert("campaign.messages.done.success");
    }, error => {
      // console.log("well that didn't work: ", error);
      this.alertService.alert("campaign.messages.done.error");
    });
    return false;
  }

}
