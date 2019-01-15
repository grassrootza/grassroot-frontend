import {Component, OnInit} from '@angular/core';
import {ENGLISH, Language, MSG_LANGUAGES, findByTwoDigitCode} from "../../../utils/language";
import {CampaignMsgRequest, CampaignMsgServerDTO} from "../../campaign-create/campaign-request";
import {FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {CampaignService} from "../../campaign.service";
import {AlertService} from "../../../utils/alert-service/alert.service";
import {ActivatedRoute, Router, Params} from "@angular/router";
import * as moment from 'moment-mini-ts';
import {CampaignInfo} from "../../model/campaign-info";

declare var $: any;

@Component({
  selector: 'app-campaign-messages',
  templateUrl: './campaign-messages.component.html',
  styleUrls: ['./campaign-messages.component.css']
})
export class CampaignMessagesComponent implements OnInit {

  public campaign: CampaignInfo;
  public channel: string = 'USSD';

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
  public defaultLanguage: Language;
  public currentLanguage: Language = ENGLISH;

  public languageForm: FormGroup;

  private campaignUid: string;

  // possibly cleaner to use one list, but might get very tricky to manage input changes, flow, etc
  public existingMessages: boolean = false;
  public priorMessages: CampaignMsgRequest[] = [];

  private messagesChanged: boolean = false;
  private _currentMessages: CampaignMsgRequest[];

  // only in USSD (no such thing if join via WhatsApp)
  public campaignWelcomeMsg: FormControl;
  public priorCampaignMsg: string = '';
  public welcomeCharsLeft: number;
  private maxMsgLength = 130;

  // for whether or not to ask for media
  public askForMediaToggle: FormControl;

  constructor(private campaignService: CampaignService,
              private alertService: AlertService,
              private fb: FormBuilder,
              private route: ActivatedRoute, private router: Router) {
    this.selectedLanguages = [ENGLISH]; // start with this as default
    this._currentMessages = [];
  }

  ngOnInit() {
    this.languageForm = this.fb.group({});
    this.campaignWelcomeMsg = this.fb.control('');

    this.askForMediaToggle = this.fb.control(false);
    this.askForMediaToggle.valueChanges.subscribe(value => this.updateRequestMedia(value));

    this.availableLanguages.forEach(language => {
      this.languageForm.addControl(language.threeDigitCode,
        this.fb.control(!(this.selectedLanguages.indexOf(language))));
    });

    this.route.params.subscribe((params:Params) => {
      console.log('route params: ', params);
      this.campaignUid = params['id'];
      this.channel = params['channel'].toUpperCase();

      this.maxMsgLength = this.channel == 'WHATSAPP' ? 320 : 130;

      this.campaignService.loadCampaign(this.campaignUid, true).subscribe(campaign => {
        this.campaign = campaign;
        this.setupDefaultLanguage();
        this.setUpMessages();
        if (campaign.outboundSmsEnabled) {
          this.setUpWelcomeMsg();
        }
      });
    });
  }

  updateRequestMedia(requestMediaState: boolean) {
    console.log('Changing media request state to: ', requestMediaState);
    if (requestMediaState) {
      this.currentTypes.push('MEDIA_PROMPT');
      if (this.findIndexOfType('MEDIA_PROMPT') == -1) {
        this.addMessageOfType('MEDIA_PROMPT', this._currentMessages.length, this.campaign.channelMessages(this.channel));
      }
    } else {
      this.sliceOutMessageType('MEDIA_PROMPT');
    }
  }

  setupDefaultLanguage() {
    let defaultLang = findByTwoDigitCode(this.campaign.defaultLanguage, ENGLISH);
    this.languageForm.addControl('defaultLanguage', this.fb.control(defaultLang.twoDigitCode));
    this.defaultLanguage = defaultLang;
  }

  setUpMessages() {
    this._currentMessages = []; // to reset, so we don't get weirdness if double click save
    this.existingMessages = this.campaign.campaignMessages && this.campaign.campaignMessages.some(msg => msg.isForChannel(this.channel));
    
    this.currentTypes = this.messageTypes[this.campaign.campaignType];
    // console.log('found error yet? existing messages: ', this.existingMessages);

    if (!this.campaign.outboundSmsEnabled) {
      this.sliceOutMessageType('SHARE_PROMPT');
      this.sliceOutMessageType('SHARE_SEND');
    }
    
    const channelMessages = this.campaign.channelMessages(this.channel);
    console.log('campaign messages from cache: ', channelMessages);

    this.currentTypes.forEach((type, index) => {
      this.addMessageOfType(type, index, channelMessages);
    });

    if (this.existingMessages && this.channel == 'WHATSAPP') {
      const isMediaRequestEnabled = this.campaign.campaignMessages.some(msg => msg.linkedActionType == 'MEDIA_PROMPT');
      this.askForMediaToggle.setValue(isMediaRequestEnabled);
    }

    // have to do a quick second loop because msg IDs may not have been set
    this._currentMessages
      .filter(msg => !!this.messageSequences[this.campaign.campaignType][msg.linkedActionType])
      .forEach(msg => {
        msg.nextMsgIds = this.messageSequences[this.campaign.campaignType][msg.linkedActionType]
          .filter(mt => this.typeMsgIds[mt] != undefined)
          .map(mt => this.typeMsgIds[mt]);
    });
    console.log('and after set up, current messages = ', this._currentMessages);

    this.selectedLanguages
      .filter(lang => this.languageForm.controls[lang.threeDigitCode])
      .forEach(lang => this.languageForm.controls[lang.threeDigitCode].patchValue(true, {onlySelf: true}));
  }

  addMessageOfType(type: string, index: number, channelMessages: CampaignMsgServerDTO[]) {
    console.log('Adding message of type: ', type);
    this.typeIndexes[type] = index;
    // first, we find if the campaign already has a message for this type
    let existingMsgIndex = this.existingMessages ? channelMessages.findIndex(msg => msg.linkedActionType === type) : -1;
    
    // second, we create an ID for the message group. the IDs are only unique within campaign, and only used in set up, so can use
    // timestamp without worrying about matching values if two users doing this for two different campaigns at once
    let msgId = existingMsgIndex != -1 ? channelMessages[existingMsgIndex].messageId : "message_" + moment().valueOf() + "_" + index;
    let msgRequest = new CampaignMsgRequest(msgId, type, this.channel,
      existingMsgIndex != -1 ? channelMessages[existingMsgIndex].getMessageMap() : new Map<string, string>());

    this.typeMsgIds[type] = msgId;
    this._currentMessages.push(msgRequest);
    this.priorMessages[type] = msgRequest;

    msgRequest.messages.forEach((value, key) => {
      let lang = this.getLanguage(key);
      if (lang && this.selectedLanguages.indexOf(lang) == -1)
        this.selectedLanguages.push(lang);
    });
  }

  findIndexOfType(type: string) {
    return !this._currentMessages ? -1 : this._currentMessages.findIndex(msg => msg.linkedActionType == type);
  }

  sliceOutMessageType(type: string) {
    const typeIndex = this.currentTypes.indexOf(type);
    if (typeIndex != -1) {
      this.currentTypes.splice(typeIndex, 1);
    }
    const msgIndex = this.findIndexOfType(type); 
    if (msgIndex != -1) {
      this._currentMessages.splice(msgIndex, 1);
    }
  }

  updateLanguages() {
    const priorLanguages = this.selectedLanguages;
    this.selectedLanguages = Object.keys(this.languageForm.value)
      .filter(key => key !== 'defaultLanguage')
      .filter(key => this.languageForm.value[key])
      .map(key => this.getLanguage(key));
    // here, check for altered language
    let difference = this.selectedLanguages.filter(x => !priorLanguages.includes(x));
    console.log('different between old and new: ', difference);
    if (difference && difference.length == 1) {
      console.log('added only one language, so opening it');
      setTimeout(() => this.currentLanguage = difference[0], 300);
      // console.log('current language now: ', this.currentLanguage);
    }

    $('#select-language-modal').modal("hide");
    this.checkForUpdatedDefaultLang();
  }

  checkForUpdatedDefaultLang() {
    if (this.languageForm.controls['defaultLanguage'] && this.languageForm.controls['defaultLanguage'].value !== this.defaultLanguage.twoDigitCode) {
      console.log('Default language changed, updating on server');
      this.alertService.showLoading();
      this.campaignService.updateCampaignDefaultLanguage(this.campaignUid, this.languageForm.controls['defaultLanguage'].value).subscribe(campaign => {
        this.alertService.hideLoading();
        this.campaign = campaign;
        this.setupDefaultLanguage();
      }, error => {
        console.log('error changing default language: ', error);
        this.alertService.hideLoading();
      })
    }
  }

  getLanguage(code: string) {
    return this.availableLanguages.find(lang => lang.threeDigitCode == code);
  }

  alterLanguage(event: object) {
    this.currentLanguage = event as Language;
  }

  storeMessages(event: object, actionType: string) {
    this.messagesChanged = true;
    this._currentMessages.find(msg => msg.linkedActionType == actionType).messages = event as Map<string, string>;
    // console.log(`stored messages, have ${this._currentMessages.length} of them`);
    // console.log("current messages: ", this._currentMessages);
  }

  setMessages() {
    console.log("okay, trying to save messages: {}", this._currentMessages);
    if (this.messagesChanged) {
      this.alertService.showLoading();
      this.campaignService.setCampaignMessages(this.campaignUid, this._currentMessages, this.channel).subscribe(campaignInfo => {
        this.alertService.alert("campaign.messages.done.success", true);
        this.alertService.hideLoading();
        this.campaign = campaignInfo;
        this.setUpMessages();
      }, error => {
        console.log("Error updating messages: ", error);
        this.alertService.hideLoading();
        this.alertService.alert("campaign.messages.done.error");
      });
    }

    let outboundMsgChanged = this.campaign.outboundSmsEnabled && (this.campaignWelcomeMsg.dirty || this.campaignWelcomeMsg.touched);
    if (outboundMsgChanged) {
      const msgValue = this.campaignWelcomeMsg.value;
      if (!!msgValue && msgValue != this.priorCampaignMsg) {
        this.updateWelcomeMsg();
      } else if (!!this.priorCampaignMsg && msgValue != this.priorCampaignMsg) {
        this.clearWelcomeMsg();
      }
    }
    return false;
  }

  setUpWelcomeMsg() {
    this.welcomeCharsLeft = this.maxMsgLength;
    this.campaignService.fetchCurrentWelcomeMsg(this.campaign.campaignUid).subscribe(message => {
      if (message) {
        this.priorCampaignMsg = message;
        this.campaignWelcomeMsg.reset(message);
        this.welcomeCharsLeft = this.maxMsgLength - message.length;
      }
    }, error => console.log('error fetching message: ', error));
  }

  updateWelcomeCharCount(event) { 
    this.welcomeCharsLeft = this.maxMsgLength - event.target.value.length;
  }

  updateWelcomeMsg() {
    this.campaignService.setCampaignWelcomeMsg(this.campaign.campaignUid, this.campaignWelcomeMsg.value).subscribe(result => {
      this.alertService.alert('Done, message updated');
      this.priorCampaignMsg = this.campaignWelcomeMsg.value;
    }, error => {
      console.log('error setting welcome msg: ', error);
      this.alertService.alert('Sorry, there was an error updating the message');
    })
  }
  
  clearWelcomeMsg() {
    this.campaignService.clearCampaignWelcomeMsg(this.campaign.campaignUid).subscribe(result => {
      this.alertService.alert('Done, message disabled');
      this.priorCampaignMsg = '';
    }, error => {
      this.alertService.alert('Error updating the message');
    })
  }

}
