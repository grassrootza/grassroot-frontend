import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {IntegrationsService} from "../integrations.service";
import {AlertService} from "../../../utils/alert.service";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/combineLatest';

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

    let navigation = Observable.combineLatest(this.route.params, this.route.queryParams,
      (params, queryParams) => ({ params, queryParams} ));

    navigation.subscribe((navigation) => {
      console.log("params: ", navigation);

      let provider = navigation.params.providerId;
      console.log("connected to: ", provider);

      this.intService.storeProviderConnectResult(provider, navigation.queryParams)
        .subscribe(response => {
          console.log("received response: ", response);
          this.alertService.alert("user.integrations." + provider + "-complete", true);
          console.log("and, rerouting back to where we started");
          this.router.navigate(['/user/integrations']);
        }, error => {
          console.log("but error: ", error);
        })
    });

  }

}
