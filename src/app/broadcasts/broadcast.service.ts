import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {
  BroadcastConfirmation, BroadcastContent, BroadcastMembers, BroadcastRequest, BroadcastSchedule,
  BroadcastTypes
} from "./model/broadcast-request";
import {DateTimeUtils} from "../utils/DateTimeUtils";
import {BroadcastParams} from "./model/broadcast-params";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";

@Injectable()
export class BroadcastService {

  fetchUrlBase = environment.backendAppUrl + "/api/broadcast/fetch/";
  createUrlBase = environment.backendAppUrl + "/api/broadcast/create/";

  private createRequest: BroadcastRequest = new BroadcastRequest();

  private _createParams: BroadcastParams = new BroadcastParams();
  public createParams: EventEmitter<BroadcastParams> = new EventEmitter(null);

  public pages: string[] = ['types', 'content', 'members', 'schedule'];
  public latestStep: number = 1; // in case we go backwards
  public currentStep: number = 1;

  public loadedFromCache: boolean = false;

  constructor(private httpClient: HttpClient, private router: Router) {
    // look for anything cached in here (constructor, not initCreate) so it's available to the route
    this.loadBroadcast();
  }

  fetchBroadcasts(type: String, entityUid: String, clearCache: boolean) {
    const fullUrl = this.fetchUrlBase + type + "/" + entityUid;
  }

  fetchCreateParams(type: string, entityUid: string): Observable<BroadcastParams> {
    const fullUrl = this.createUrlBase + type + "/info/" + entityUid;
    return this.httpClient.get<BroadcastParams>(fullUrl).map(result => {
      console.log("create fetch result: ", result);
      this._createParams = result as BroadcastParams; // note: because JS typing is such a disaster, this doesn't seem to work
      this.createParams.emit(this._createParams);
      return result;
    });
  }

  getCreateParams(): BroadcastParams {
    return this._createParams;
  }

  initCreate(type: string, parentId: string) {
    if (this.createRequest.type != type || this.createRequest.parentId != parentId) {
      console.log("create type or parent switched, clearing store");
      if (this.loadedFromCache) {
        // something was sitting in cache, but user switched entity or type, so remove
        this.clearBroadcast();
      }
      this.createRequest.type = type;
      this.createRequest.parentId = parentId;
      this.latestStep = 1;
    }
  }

  getTypes(): BroadcastTypes {
    return {
      shortMessage: this.createRequest.sendShortMessages,
      email: this.createRequest.sendEmail,
      facebook: this.createRequest.postToFacebook,
      facebookPage: this.createRequest.facebookPage,
      twitter: this.createRequest.postToTwitter,
      twitterAccount: this.createRequest.twitterAccount
    };
  }

  setTypes(types: BroadcastTypes) {
    console.log("setting types to : ", types);
    this.createRequest.sendShortMessages = types.shortMessage;
    this.createRequest.sendEmail = types.email;
    this.createRequest.postToFacebook = types.facebook;
    this.createRequest.facebookPage = types.facebookPage;
    this.createRequest.postToTwitter = types.twitter;
    this.createRequest.twitterAccount = types.twitterAccount;
    this.saveBroadcast();
  }

  getContent(): BroadcastContent {
    return {
      title: this.createRequest.title,
      shortMessage: this.createRequest.shortMessageString,
      emailContent: this.createRequest.emailContent,
      facebookPost: this.createRequest.facebookContent,
      facebookLink: this.createRequest.facebookLink,
      twitterPost: this.createRequest.twitterContent,
      twitterLink: this.createRequest.twitterLink
    }
  }

  setContent(content: BroadcastContent) {
    this.createRequest.title = content.title;
    this.createRequest.shortMessageString = content.shortMessage;
    this.createRequest.emailContent = content.emailContent;
    this.createRequest.facebookContent = content.facebookPost;
    this.createRequest.facebookLink = content.facebookLink;
    this.createRequest.twitterContent = content.twitterPost;
    this.createRequest.twitterLink = content.twitterLink;
    this.saveBroadcast();
  }

  getMembers(): BroadcastMembers {
    return {
      selectionType: this.createRequest.selectionType,
      taskTeams: this.createRequest.subgroups,
      provinces: this.createRequest.provinces,
      topics: this.createRequest.topics
    }
  }

  setMembers(members: BroadcastMembers) {
    this.createRequest.selectionType = members.selectionType;
    this.createRequest.subgroups = members.taskTeams;
    this.createRequest.provinces = members.provinces;
    this.createRequest.topics = members.topics;
    this.saveBroadcast();
  }

  getSchedule(): BroadcastSchedule {
    return  {
      sendType: this.createRequest.sendType,
      sendDate: this.createRequest.sendDate,
      dateTimeEpochMillis: DateTimeUtils.fromDate(new Date())
    }
  }

  setSchedule(schedule: BroadcastSchedule) {
    this.createRequest.sendType = schedule.sendType;
    this.createRequest.sendDate = schedule.sendDate;
    this.saveBroadcast(); // since we remain on this step
  }

  // todo : populate fields like number messages etc by querying back end
  getConfirmationFields(): BroadcastConfirmation {
    let cn = new BroadcastConfirmation();
    cn.sendShortMessage = this.createRequest.sendShortMessages;
    cn.sendEmail = this.createRequest.sendEmail;
    cn.postFacebook = this.createRequest.postToFacebook;
    cn.fbPageName = this.getFbDisplayName(this.createRequest.facebookPage);
    cn.postTwitter = this.createRequest.postToTwitter;
    cn.twitterAccount = this.createRequest.twitterAccount;

    cn.smsNumber = this.createRequest.sendShortMessages ? this._createParams.allMemberCount : 0;

    cn.totalMemberCount = this._createParams.allMemberCount;
    // cn.sendEmailCount = 50;

    cn.provinces = this.createRequest.provinces;
    cn.topics = this.createRequest.topics;

    cn.sendTimeDescription = this.createRequest.sendType;
    cn.sendTime = this.createRequest.sendDate; // todo: format

    cn.broadcastCost = (cn.smsNumber * this._createParams.smsCostCents / 100).toFixed(2);

    return cn;
  }

  private getFbDisplayName(fbUserId: string): string {
    return this._createParams.facebookPages.find(page => page.providerUserId == fbUserId).displayName;
  }

  sendBroadcast() {
    if (this.createRequest.sendType == "FUTURE") {
      console.log("converting future date time : ", this.createRequest.sendDate);
      this.createRequest.sendDateTimeMillis = DateTimeUtils.convertDateStringToEpochMilli(this.createRequest.sendDate);
      console.log("converted epoch millis : ", this.createRequest.sendDateTimeMillis);
    }

    const fullUrl = this.createUrlBase + this.createRequest.type + "/" + this.createRequest.parentId;
    return this.httpClient.post(fullUrl, this.createRequest);
  }

  cancelCurrentCreate() {
    let parentRoute = this.createRequest.type == 'campaign' ? '/campaign/' + this.createRequest.parentId :
      '/group/' + this.createRequest.parentId;
    this.clearBroadcast();
    this.router.navigate([parentRoute]);
    return false; // in case called on an anchor tag
  }

  currentType(): String {
    return this.createRequest.type;
  }

  parentId(): String {
    return this.createRequest.parentId;
  }

  routeUrl(child: String) {
    return '/broadcast/create/' + this.currentType() + '/' + this.parentId() + '/' + child;
  }

  /*
  Below helps persist and retrieve in-progress broadcast
   */
  saveBroadcast() {
    localStorage.setItem('broadcastCreateRequest', JSON.stringify(this.createRequest));
  }

  loadBroadcast() {
    let storedString = localStorage.getItem('broadcastCreateRequest');
    console.log("stored string: ", storedString);
    if (storedString) {
      this.createRequest = JSON.parse(storedString);
      this.loadedFromCache = true;
    } else {
      console.log("nothing in cache, just return new empty");
      this.createRequest = new BroadcastRequest();
    }
    let storedStep = localStorage.getItem('broadcastCreateStep');
    this.latestStep = Number(storedStep) || 1;
    this.currentStep = this.latestStep;
  }

  clearBroadcast() {
    this.createRequest = new BroadcastRequest();
    localStorage.removeItem('broadcastCreateRequest');
    localStorage.removeItem('broadcastCreateStep');
  }

  setPageCompleted(page: string) {
    let nextPage = this.pages.indexOf(page) + 1 + 1; // 1 for zero base, 1 to go to next
    if (this.latestStep < nextPage) {
      this.latestStep = nextPage;
      localStorage.setItem('broadcastCreateStep', this.latestStep.toString());
    }
  }

}
