import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {
  BroadcastConfirmation,
  BroadcastContent,
  BroadcastCost,
  BroadcastMembers,
  BroadcastRequest,
  BroadcastSchedule,
  BroadcastTypes
} from "./model/broadcast-request";
import {DateTimeUtils} from "../utils/DateTimeUtils";
import {BroadcastParams, getBroadcastParams} from "./model/broadcast-params";
import {Observable} from "rxjs/Observable";
import {Router} from "@angular/router";
import {Broadcast, BroadcastPage} from './model/broadcast';
import * as moment from 'moment';

@Injectable()
export class BroadcastService {

  fetchUrlBase = environment.backendAppUrl + "/api/broadcast/fetch/";
  createUrlBase = environment.backendAppUrl + "/api/broadcast/create/";
  imageUploadUrl = environment.backendAppUrl + "/api/broadcast/create/image/upload";

  public createRequest: BroadcastRequest = new BroadcastRequest();
  private createCounts: BroadcastCost = new BroadcastCost();

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
      taskTeams: this.createRequest.taskTeams,
      memberFilter: this.createRequest.getMemberFilter(),
      skipSmsIfEmail: this.createRequest.skipSmsIfEmail
    }
  }

  setMembers(members: BroadcastMembers) {
    this.createRequest.selectionType = members.selectionType;
    this.createRequest.taskTeams = members.taskTeams;
    this.createRequest.setMemberFilter(members.selectionType, members.memberFilter);
    this.createRequest.skipSmsIfEmail = members.skipSmsIfEmail;
    this.saveBroadcast();
  }

  setMessageCounts(costs: BroadcastCost) {
    this.createCounts = costs;
  }

  getSchedule(): BroadcastSchedule {
    return  {
      sendType: this.createRequest.sendType,
      sendMoment: moment(this.createRequest.sendDateTimeMillis),
      sendDateTimeMillis: this.createRequest.sendDateTimeMillis,
      sendDateString: moment(this.createRequest.sendDateTimeMillis).format("HH:mm, ddd MM YYYY"),
      dateEpochMillis: DateTimeUtils.dateFromDate(new Date()),
      timeEpochMillis: DateTimeUtils.timeFromDate(new Date())
    }
  }

  setSchedule(schedule: BroadcastSchedule) {
    console.log("broadcast now looks like: ", this.createRequest);
    this.createRequest.sendType = schedule.sendType;
    this.createRequest.sendDateString = schedule.sendDateString;
    this.createRequest.sendDateTimeMillis = schedule.sendDateTimeMillis;
    this.saveBroadcast(); // since we remain on this step
  }

  getConfirmationFields(): BroadcastConfirmation {
    console.log("getting confirmation fields, request: ", this.createRequest);
    let cn = new BroadcastConfirmation();
    cn.sendShortMessage = this.createRequest.sendShortMessages;
    cn.sendEmail = this.createRequest.sendEmail;
    cn.postFacebook = this.createRequest.postToFacebook;
    cn.fbPageNames = this.getFbDisplayNames(this.createRequest.facebookPages);
    cn.postTwitter = this.createRequest.postToTwitter;
    cn.twitterAccount = this.createRequest.twitterAccount;

    console.log("stored count: ", this.createCounts.totalNumber);
    cn.totalMemberCount = this.createCounts.totalNumber;
    console.log("total member count: ", cn.totalMemberCount);
    cn.smsNumber = this.createCounts.smsNumber;
    cn.sendEmailCount = this.createCounts.emailNumber;
    cn.broadcastCost = this.createCounts.broadcastCost;

    cn.provinces = this.createRequest.provinces;
    cn.topics = this.createRequest.topics;

    cn.sendTimeDescription = this.createRequest.sendType;
    cn.sendDateString = this.createRequest.sendDateString;

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
    const fullUrl = this.createUrlBase + this.createRequest.type + "/" + this.createRequest.parentId;
    console.log("sending broadcast, create request = ", this.createRequest);
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
      .set('sort', 'creationTime,desc')
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
              bc.fbPages,
              bc.twitterAccount != null ? bc.twitterAccount : "",
              bc.dateTimeSent != null ? DateTimeUtils.getDateFromJavaInstant(bc.dateTimeSent) : null,
              bc.scheduledSendTime != null ? DateTimeUtils.getDateFromJavaInstant(bc.scheduledSendTime) : null,
              bc.costEstimate,
              bc.smsContent,
              bc.emailContent,
              bc.fbPost,
              bc.twitterPost,
              bc.hasFilter,
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

  sendMeetingBroadcast(meetingUid: string, message: string) {
    const fullUrl = this.createUrlBase + "task/MEETING/" + meetingUid;
    let params = new HttpParams().set("message", message);
    return this.httpClient.post(fullUrl, null, {params: params});
  }

}
