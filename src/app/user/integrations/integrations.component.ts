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

  removeTwitter() {
    this.removeAccount("twitter");
    return false;
  }

  removeAccount(provider: string, page?: ManagedPage) {
    console.log("removing: ", provider);
    this.alertService.showLoading();
    const pageId = provider == 'twitter' ? this.twitterAccount.twitterUserId : page.providerUserId;
    this.intService.removeProviderPage(provider, pageId).subscribe(settingsList => {
      console.log("settings list received: ", settingsList);
      this.settingsList = settingsList;
      this.alertService.hideLoadingDelayed();
    }, error => {
      console.log("whoops, didn't work: ", error);
      this.alertService.hideLoadingDelayed();
    });
    return false;
  }

  removeAllFb() {
    this.alertService.showLoading();
    this.intService.removeProviderPage('facebook').subscribe(result => {
      console.log('FB removed! Result: ', result);
      this.alertService.hideLoading();
      this.alertService.alert('Done. Your integration has been removed');
    }, error => {
      console.log('Failed to remove: ', error);
      this.alertService.hideLoading();
    })
    return false;
  }

  fetchAccessToken() {
    this.userService.fetchAccessToken().subscribe(token => this.accessToken = token);
  }

  clearAccessToken() {
    this.accessToken = null;
  }

}
