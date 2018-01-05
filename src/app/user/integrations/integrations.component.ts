import {Component, OnInit} from '@angular/core';
import {IntegrationsService} from "./integrations.service";

@Component({
  selector: 'app-integrations',
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.css']
})
export class IntegrationsComponent implements OnInit {

  constructor(private intService: IntegrationsService) {}

  ngOnInit() {
    // fetch the current status
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

}
