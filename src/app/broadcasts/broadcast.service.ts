import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {
  BroadcastConfirmation, BroadcastContent, BroadcastMembers, BroadcastRequest, BroadcastSchedule,
  BroadcastTypes
} from "./model/broadcast-request";
import {DateTimeUtils} from "../utils/DateTimeUtils";
import {BroadcastParams, getBroadcastParams} from "./model/broadcast-params";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {Broadcast, BroadcastPage} from './model/broadcast';
import {GroupInfo} from "../groups/model/group-info.model";

@Injectable()
export class BroadcastService {

  fetchUrlBase = environment.backendAppUrl + "/api/broadcast/fetch/";
  createUrlBase = environment.backendAppUrl + "/api/broadcast/create/";
  imageUploadUrl = environment.backendAppUrl + "/api/broadcast/create/image/upload";

  private createRequest: BroadcastRequest = new BroadcastRequest();

  private _createParams: BroadcastParams = new BroadcastParams();
  public createParams: EventEmitter<BroadcastParams> = new EventEmitter(null);

  private _group: GroupInfo;
  private group: EventEmitter<GroupInfo> = new EventEmitter<GroupInfo>(null);

  public pages: string[] = ['types', 'content', 'members', 'schedule'];
  public latestStep: number = 1; // in case we go backwards
  public currentStep: number = 1;

  public loadedFromCache: boolean = false;

  constructor(private httpClient: HttpClient, private router: Router) {
    // look for anything cached in here (constructor, not initCreate) so it's available to the route
    this.loadBroadcast();
  }

  fetchCreateParams(type: string, entityUid: string): Observable<BroadcastParams> {
    const fullUrl = this.createUrlBase + type + "/info/" + entityUid;
    return this.httpClient.get<BroadcastParams>(fullUrl).map(result => {
      console.log("create fetch result: ", result);
      this._createParams = getBroadcastParams(result);
      this.createParams.emit(this._createParams);
      return result;
    });
  }

  getCreateParams(): BroadcastParams {
    return this._createParams;
  }

  initCreate(type: string, parentId: string) {
    console.log(`type: ${type}, parentId: ${parentId}`);
    if (this.createRequest.type != type || this.createRequest.parentId != parentId) {
      console.log("create type or parent switched, clearing store");
      if (this.loadedFromCache) {
        // something was sitting in cache, but user switched entity or type, so remove
        this.clearBroadcast();
      }
      this.createRequest.type = type;
      this.createRequest.parentId = parentId;
      this.createRequest.broadcastId = this._createParams.broadcastId;
      console.log("create request done, broadcastId = ", this.createRequest.broadcastId);
      this.latestStep = 1;
    }
  }

  getTypes(): BroadcastTypes {
    return {
      shortMessage: this.createRequest.sendShortMessages,
      email: this.createRequest.sendEmail,
      facebook: this.createRequest.postToFacebook,
      facebookPages: this.createRequest.facebookPages,
      twitter: this.createRequest.postToTwitter,
      twitterAccount: this.createRequest.twitterAccount
    };
  }

  setTypes(types: BroadcastTypes) {
    console.log("setting types to : ", types);
    this.createRequest.sendShortMessages = types.shortMessage;
    this.createRequest.sendEmail = types.email;
    this.createRequest.postToFacebook = types.facebook;
    this.createRequest.facebookPages = types.facebookPages;
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
      facebookLinkCaption: this.createRequest.facebookLinkCaption,
      facebookImageKey: this.createRequest.facebookImageKey,
      twitterPost: this.createRequest.twitterContent,
      twitterLink: this.createRequest.twitterLink,
      twitterLinkCaption: this.createRequest.twitterLinkCaption,
      twitterImageKey: this.createRequest.twitterImageKey,
      smsMergeField: "",
      emailMergeField: ""
    }
  }

  setContent(content: BroadcastContent) {
    this.createRequest.title = content.title;
    this.createRequest.shortMessageString = content.shortMessage;
    this.createRequest.emailContent = content.emailContent;
    this.createRequest.facebookContent = content.facebookPost;
    this.createRequest.facebookLink = content.facebookLink;
    this.createRequest.facebookImageKey = content.facebookImageKey;
    this.createRequest.twitterContent = content.twitterPost;
    this.createRequest.twitterLink = content.twitterLink;
    this.createRequest.twitterImageKey = content.twitterImageKey;
    this.saveBroadcast();
    console.log("saved fb image key: ", this.createRequest.facebookImageKey);
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
      dateEpochMillis: DateTimeUtils.dateFromDate(new Date()),
      timeEpochMillis: DateTimeUtils.timeFromDate(new Date())
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
    cn.fbPageNames = this.getFbDisplayNames(this.createRequest.facebookPages);
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

  private getFbDisplayNames(fbUserIds: string[]): string[] {
    if (this._createParams.facebookPages && fbUserIds) {
      return fbUserIds.map(fbUserId => this._createParams.facebookPages.find(page => page.providerUserId == fbUserId).displayName);
    } else {
      return [];
    }
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

  currentType(): string {
    return this.createRequest.type;
  }

  parentId(): string {
    return this.createRequest.parentId;
  }

  parentViewRoute(): string {
    return (this.createRequest) ? (this.createRequest.type == 'campaign' ? '/campaign/' : '/group/') + this.createRequest.parentId :
      '/home';
  }

  inboundGroupUrl(groupId: string): string {
    return environment.frontendAppUrl + "/join/group/" + groupId + "?broadcastId=" + this.createRequest.broadcastId;
  }

  /*
  Below helps persist and retrieve in-progress broadcast
   */
  saveBroadcast() {
    localStorage.setItem('broadcastCreateRequest', JSON.stringify(this.createRequest));
  }

  loadBroadcast() {
    this.createRequest = new BroadcastRequest();
    let storedString = localStorage.getItem('broadcastCreateRequest');
    console.log("stored string: ", storedString);
    if (storedString) {
      let cachedRequest = JSON.parse(storedString);
      this.createRequest.copyFields(cachedRequest);
    } else {
      console.log("nothing in cache, just return new empty");
      this.createRequest = new BroadcastRequest();
    }
    let storedStep = localStorage.getItem('broadcastCreateStep');
    this.latestStep = Number(storedStep) || 1;
    this.currentStep = this.latestStep;
  }

  clearBroadcast() {
    this.createRequest.clear();
    localStorage.removeItem('broadcastCreateRequest');
    localStorage.removeItem('broadcastCreateStep');
  }

  setPageCompleted(page: string) {
    let nextPage = this.pages.indexOf(page) + 1 + 1;
    // 1 for zero base, 1 to go to next
    if (this.latestStep < nextPage) {
      this.latestStep = nextPage;
      localStorage.setItem('broadcastCreateStep', this.latestStep.toString());
    }
  }

  uploadImage(image): Observable<any> {
    const fullUrl = this.imageUploadUrl;
    return this.httpClient.post(fullUrl, image, { responseType: 'text' });
  }

  getGroupBroadcasts(groupUid: string, broadcastSchedule: string, pageNo: number, pageSize: number): Observable<BroadcastPage>{
    console.log("Fetching group broadcasts");
    let params = new HttpParams()
      .set('page', pageNo.toString())
      .set('size', pageSize.toString())
      .set('broadcastSchedule', broadcastSchedule);
    const fullUrl = this.fetchUrlBase + 'group/' + groupUid;

    return this.httpClient.get<BroadcastPage>(fullUrl, {params: params})
      .map(
        result => {
          console.log("Group broadcasts json object from server: ", result);
          let transformetContent = result.content.map(

            bc => new Broadcast(
              bc.title,
              bc.shortMessageSent,
              bc.emailSent,
              bc.smsCount,
              bc.emailCount,
              bc.fbPage != null ? bc.fbPage : "",
              bc.twitterAccount != null ? bc.twitterAccount : "",
              bc.dateTimeSent != null ? DateTimeUtils.getDateFromJavaInstant(bc.dateTimeSent) : null,
              bc.scheduledSendTime != null ? DateTimeUtils.getDateFromJavaInstant(bc.scheduledSendTime) : null,
              bc.costEstimate,
              bc.smsContent,
              bc.emailContent,
              bc.fbPost,
              bc.twitterPost,
              bc.smsCount + bc.emailCount,
              bc.provinces,
              bc.topics
            )
          );
          return new BroadcastPage(
            result.number,
            result.totalPages,
            result.totalElements,
            result.size,
            result.first,
            result.last,
            transformetContent
          )
        }
      )
  }

}
