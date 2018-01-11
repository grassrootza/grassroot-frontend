import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UserService} from "../user/user.service";
import {environment} from "../../environments/environment";
import {
  BroadcastConfirmation,
  BroadcastContent,
  BroadcastMembers,
  BroadcastRequest,
  BroadcastSchedule,
  BroadcastTypes
} from "./model/broadcast-request";
import {DateTimeUtils} from "../utils/DateTimeUtils";
import {BroadcastParams} from "./model/broadcast-params";
import {Observable} from "rxjs/Observable";
import {Broadcast, BroadcastPage} from './model/broadcast';
import {GroupRole} from '../groups/model/group-role';
import {Membership, MembersPage} from '../groups/model/membership.model';

@Injectable()
export class BroadcastService {

  fetchUrlBase = environment.backendAppUrl + "/api/broadcast/fetch/";
  createUrlBase = environment.backendAppUrl + "/api/broadcast/create/";

  private createRequest: BroadcastRequest = new BroadcastRequest();
  private createParams: BroadcastParams = new BroadcastParams();

  public currentStep: number = 1;

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  fetchBroadcasts(type: String, entityUid: String, clearCache: boolean) {
    const fullUrl = this.fetchUrlBase + type + "/" + entityUid;
  }

  fetchCreateParams(type: string, entityUid: string): Observable<BroadcastParams> {
    const fullUrl = this.createUrlBase + type + "/info/" + entityUid;
    return this.httpClient.get<BroadcastParams>(fullUrl).map(result => {
      this.createParams = result;
      return result;
    });
  }

  // todo : watch this if have some complex user path (e.g., group -> create broadcast -> campaigns (via nav) -> campaign -> create)
  initCreate(type: String, parentId: String) {
    this.createRequest = new BroadcastRequest();
    this.createRequest.type = type;
    this.createRequest.parentId = parentId;
    this.currentStep = 1
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
    this.createRequest.sendShortMessages = types.shortMessage;
    this.createRequest.sendEmail = types.email;
    this.createRequest.postToFacebook = types.facebook;
    this.createRequest.facebookPage = types.facebookPage;
    this.createRequest.postToTwitter = types.twitter;
    this.createRequest.twitterAccount = types.twitterAccount;
    this.currentStep = 2;
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
    this.currentStep = 3;
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
    this.currentStep = 4;
  }

  getSchedule(): BroadcastSchedule {
    return  {
      sendType: this.createRequest.sendType,
      sendDate: this.createRequest.sendDate
    }
  }

  setSchedule(schedule: BroadcastSchedule) {
    this.createRequest.sendType = schedule.sendType;
    this.createRequest.sendDate = schedule.sendDate;
  }

  // todo : populate fields like number messages etc by querying back end
  getConfirmationFields(): BroadcastConfirmation {
    let cn = new BroadcastConfirmation();
    cn.sendShortMessage = this.createRequest.sendShortMessages;
    cn.sendEmail = this.createRequest.sendEmail;
    cn.postFacebook = this.createRequest.postToFacebook;
    cn.facebookPage = this.createRequest.facebookPage;
    cn.postTwitter = this.createRequest.postToTwitter;
    cn.twitterAccount = this.createRequest.twitterAccount;

    cn.sendShortMessageCount = 100;
    cn.sendEmailCount = 50;
    cn.totalMemberCount = 150;

    cn.provinces = this.createRequest.provinces;
    cn.topics = this.createRequest.topics;

    cn.sendTime = this.createRequest.sendDate; // todo: slightly more complex logic
    cn.sendTimeDescription = "Sending now"; // todo : make real

    return cn;
  }

  sendBroadcast() {
    if (this.createRequest.sendType == "FUTURE") {
      console.log("converting future date time : ", this.createRequest.sendDate);
      this.createRequest.sendDateTimeMillis = DateTimeUtils.convertDateStringToEpochMilli(this.createRequest.sendDate);
      console.log("converted epoch millis : ", this.createRequest.sendDateTimeMillis);
    }

    const fullUrl = this.createUrlBase + this.createRequest.type + "/" + this.createRequest.parentId;
    return this.httpClient.post(fullUrl, this.createRequest);
    // invoke http client
  }

  cancelRoute(): String {
    return this.createRequest.type == 'campaign' ? '/campaign/' + this.createRequest.parentId :
      '/group/' + this.createRequest.parentId;
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
