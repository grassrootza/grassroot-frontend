import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BroadcastService} from "../broadcast.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AlertService} from "../../utils/alert.service";

@Component({
  selector: 'app-broadcast-create',
  templateUrl: './broadcast-create.component.html',
  styleUrls: ['./broadcast-create.component.css']
})
export class BroadcastCreateComponent implements OnInit, AfterViewInit {

  type: string;
  parentId: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private alertService: AlertService,
              private broadcastService: BroadcastService) {
  }

  private currentTab: string = "types";

  ngOnInit() {
    console.log("Initiating new subscribe flow");
    this.route.params.subscribe(params => {
      this.type = params["type"];
      this.parentId = params["parentId"];
      this.broadcastService.fetchCreateParams(this.type, this.parentId).subscribe(createParams => {
        console.log("received params: ", createParams);
        this.broadcastService.initCreate(this.type, this.parentId);
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.alertService.hideLoading()
    }, 300);

  }

  getCurrentStep(): number {
    return this.broadcastService.currentStep;
  }

}
