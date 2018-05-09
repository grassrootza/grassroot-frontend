import {Component, OnInit} from '@angular/core';
import {IntegrationsService} from "./integrations.service";
import {FacebookPage, IntegrationSettingsList, ManagedPage, TwitterAccount} from "../model/integration-settings";
import {AlertService} from "../../utils/alert-service/alert.service";
import {UserService} from '../user.service';

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.css', '../profile-container/user-profile.component.css']
})
export class IntegrationsComponent implements OnInit {

  facebookImageUrl = "https://graph.facebook.com/{}/picture";
  accessToken: string = "";

  settingsList: IntegrationSettingsList = new IntegrationSettingsList();

  fbPages: FacebookPage[];
  fbFetched: boolean = false;

  twitterAccount: TwitterAccount;
  twitterFetched: boolean = false;

  constructor(private intService: IntegrationsService, private userService: UserService, private alertService: AlertService) {}

  ngOnInit() {
    this.fetchFbStatus();
    this.fetchTwitterStatus();
  }

  fetchFbStatus() {
    this.intService.fetchFbAccounts().subscribe(fbPages => {
      this.fbPages = fbPages;
      this.fbFetched = true;
    })
  }

  fetchTwitterStatus() {
    this.intService.fetchTwitterAccount().subscribe(twitterAccount => {
      console.log("fetched twitter account: ", twitterAccount);
      this.twitterAccount = twitterAccount;
      this.twitterFetched = true;
    })
  }

  connectFacebook() {
    this.intService.initiateFbConnect().subscribe(redirectUrl => {
      console.log("here is the redirectURL : ", redirectUrl);
      window.location.href = redirectUrl;
    }, error2 => {
      console.log("error initiating FB call: ", error2);
    });
    return false;
  }

  removeFb(page: ManagedPage) {
    this.removeAccount("facebook", page);
    return false;
  }

  connectTwitter() {
    this.intService.initiateTwitterConnect().subscribe(redirectUrl => {
      console.log("twitter redirect URL : ", redirectUrl);
      window.location.href = redirectUrl;
    }, error2 => {
      console.log("error initiating Twitter call: ", error2);
    })
  }

  removeTwitter(page: ManagedPage) {
    this.removeAccount("twitter", page);
    return false;
  }

  removeAccount(provider: string, page: ManagedPage) {
    console.log("removing: ", provider);
    this.alertService.showLoading();
    this.intService.removeProviderPage(provider, page.providerUserId).subscribe(settingsList => {
      console.log("settings list received: ", settingsList);
      this.settingsList = settingsList;
      this.alertService.hideLoadingDelayed();
    }, error => {
      console.log("whoops, didn't work: ", error);
      this.alertService.hideLoadingDelayed();
    });
    return false;
  }

  fetchAccessToken() {
    this.userService.fetchAccessToken().subscribe(token => this.accessToken = token);
  }

  clearAccessToken() {
    this.accessToken = null;
  }

}
