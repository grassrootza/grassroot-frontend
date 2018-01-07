import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {IntegrationsService} from "../integrations.service";
import {AlertService} from "../../../utils/alert.service";

@Component({
  selector: 'app-integration-connect',
  templateUrl: './integration-connect.component.html',
  styleUrls: ['./integration-connect.component.css']
})
export class IntegrationConnectComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private intService: IntegrationsService,
              private alertService: AlertService,
              private router: Router) { }

  ngOnInit() {

    this.route.queryParams.subscribe((params: Params) => {
      console.log("params: ", params);

      let provider = params['providerId'];
      let code = params['code'];
      let status = params['status'];

      console.log("connected to: ", provider);
      console.log("code: ", code);

      this.intService.storeFbConnectResult(params)
        .subscribe(response => {
          console.log("received response: ", response);
          this.alertService.alert("user.integrations.fb-complete", true);
          console.log("and, rerouting back to where we started");
          this.router.navigate(['/user/integrations']);
        }, error => {
          console.log("but error: ", error);
        })
    });

  }

}
