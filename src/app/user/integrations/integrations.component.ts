import {Component, OnInit} from '@angular/core';
import {IntegrationsService} from "./integrations.service";
import {IntegrationSettingsList} from "../model/integration-settings";

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.css', '../profile-container/user-profile.component.css']
})
export class IntegrationsComponent implements OnInit {

  facebookImageUrl = "https://graph.facebook.com/v2.5/{}/picture";

  settingsList: IntegrationSettingsList = new IntegrationSettingsList();

  // what follows is necessary, because, well, JavaScript
  public fbKeys: string[];
  public twKeys: string[];
  public gKeys: string[];

  constructor(private intService: IntegrationsService) {}

  ngOnInit() {
    // fetch the current status: note, thought about using a router here, but don't want
    // user to have to go back if something goes wrong with getting connection status, etc.
    // and we can display the list of services while getting pages
    this.intService.fetchCurrentConnections().subscribe(settingsList => {
      this.settingsList = settingsList;
      this.fbKeys = Object.keys(settingsList.facebook.managedPages);
      this.twKeys = Object.keys(settingsList.twitter.managedPages);
      this.gKeys = Object.keys(settingsList.google.managedPages);
      console.log("entries ? ", this.fbKeys);
    });
  }

  connectFacebook() {
    this.intService.initiateFbConnect().subscribe(redirectUrl => {
      console.log("here is the redirectURL : {}", redirectUrl);
      window.location.href = redirectUrl;
    }, error2 => {
      console.log("error initiating FB call: ", error2);
    });
    return false;
  }

  connectTwitter() {

  }

  connectGoogle() {

  }

}
