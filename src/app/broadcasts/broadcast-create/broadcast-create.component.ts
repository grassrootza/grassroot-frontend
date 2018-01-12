import {Component, OnInit} from '@angular/core';
import {BroadcastService} from "../broadcast.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-broadcast-create',
  templateUrl: './broadcast-create.component.html',
  styleUrls: ['./broadcast-create.component.css']
})
export class BroadcastCreateComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private broadcastService: BroadcastService) {
  }

  private currentTab: string = "types";

  ngOnInit() {
    console.log("Initiating new subscribe flow");
    this.route.params.subscribe(params => {
      console.log("got the parameters: ", params);
      this.broadcastService.fetchCreateParams(params["type"], params["parentId"]).subscribe(createParams => {
        console.log("here are the fetch create params: ", createParams);
        this.broadcastService.initCreate(params["type"], params["parentId"]);
      }, error => {
        console.log("failed, error: ", error);
      });
    });


    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        let uri = ev.urlAfterRedirects;
        this.currentTab = uri.substring(uri.lastIndexOf("/") + 1);
        this.broadcastService.currentStep = this.broadcastService.pages.indexOf(this.currentTab) + 1;
      }
    });
  }

  getCurrentStep(): number {
    return this.broadcastService.currentStep;
  }

}
