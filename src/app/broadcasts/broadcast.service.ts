import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {environment} from "../../environments/environment.prod";
import {
  BroadcastConfirmation, BroadcastContent, BroadcastMembers, BroadcastRequest, BroadcastSchedule,
  BroadcastTypes
} from "./model/broadcast-request";

@Injectable()
export class BroadcastService {

  fetchUrlBase = environment.backendAppUrl + "/api/broadcast/fetch/";

  private createRequest: BroadcastRequest = new BroadcastRequest();

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  fetchBroadcasts(type: String, entityUid: String, clearCache: boolean) {
    const fullUrl = this.fetchUrlBase + type + "/" + entityUid;
  }

  // todo : watch this if have some complex user path (e.g., group -> create broadcast -> campaigns (via nav) -> campaign -> create)
  initCreate(type: String, parentId: String) {
    this.createRequest = new BroadcastRequest();
    this.createRequest.type = type;
    this.createRequest.parentId = parentId;
  }

  sendBroadcast() {

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
  }

  getSchedule(): BroadcastSchedule {
    return  {
      sendType: this.createRequest.sendType,
      sendNow: this.createRequest.sendNow,
      sendOnJoin: this.createRequest.sendOnJoin,
      sendAtTime: this.createRequest.sendAtTime,
      sendDate: this.createRequest.sendDate
    }
  }

  setSchedule(schedule: BroadcastSchedule) {
    this.createRequest.sendNow = schedule.sendNow;
    this.createRequest.sendOnJoin = schedule.sendOnJoin;
    this.createRequest.sendAtTime = schedule.sendAtTime;
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

  confirmAndSend(confirmFields: BroadcastConfirmation) {
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

  firstInvalidPath(): String {
    if (!this.createRequest.checkTypesSet()) {
      return "types";
    }
    if (!this.createRequest.checkContentSet()) {
      return "content";
    }
    // todo : think about other steps (e.g., depending on type selected)
    return "";
  }

}
