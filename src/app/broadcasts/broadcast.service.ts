import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {environment} from "../../environments/environment.prod";
import {BroadcastContent, BroadcastMembers, BroadcastRequest, BroadcastTypes} from "./model/broadcast-request";

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
      allMembers: this.createRequest.allMembers,
      taskTeams: this.createRequest.subgroups,
      provinces: this.createRequest.provinces,
      topics: this.createRequest.topics
    }
  }

  setMembers(members: BroadcastMembers) {
    this.createRequest.allMembers = members.allMembers;
    this.createRequest.subgroups = members.taskTeams;
    this.createRequest.provinces = members.provinces;
    this.createRequest.topics = members.topics;
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

}
