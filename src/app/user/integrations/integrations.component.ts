import {Component, OnInit} from '@angular/core';
import {IntegrationsService} from "./integrations.service";
import {IntegrationSettingsList, ManagedPage} from "../model/integration-settings";
import {AlertService} from "../../utils/alert-service/alert.service";

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.css', '../profile-container/user-profile.component.css']
})
export class IntegrationsComponent implements OnInit {

  facebookImageUrl = "https://graph.facebook.com/v2.5/{}/picture";

  settingsList: IntegrationSettingsList = new IntegrationSettingsList();

  constructor(private intService: IntegrationsService, private alertService: AlertService) {}

  ngOnInit() {
    // fetch the current status: note, thought about using a router here, but don't want
    // user to have to go back if something goes wrong with getting connection status, etc.
    // and we can display the list of services while getting pages
    this.alertService.showLoading();
    this.intService.fetchCurrentConnections().subscribe(settingsList => {
      this.settingsList = settingsList;
      this.alertService.hideLoadingDelayed();
    }, error => {
      console.log("error!", error);
      this.alertService.hideLoadingDelayed();
    });
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

  connectGoogle() {

  }

}
