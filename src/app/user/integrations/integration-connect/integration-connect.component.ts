import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {IntegrationsService} from "../integrations.service";

@Component({
  selector: 'app-integration-connect',
  templateUrl: './integration-connect.component.html',
  styleUrls: ['./integration-connect.component.css']
})
export class IntegrationConnectComponent implements OnInit {

  public provider: String = null;

  constructor(private route: ActivatedRoute, private intService: IntegrationsService) { }

  ngOnInit() {

    // todo : note this is not currently working because can't figure out how to preserve params, so need to get it to work first
    this.route.queryParams.subscribe((params: Params) => {
      console.log("params: ", params);

      let provider = params['providerId'];
      let code = params['code'];
      let status = params['status'];

      console.log("connected to: ", provider);
      console.log("code: ", code);

      this.intService.storeFbConnectResult(params);
    });

  }

}
