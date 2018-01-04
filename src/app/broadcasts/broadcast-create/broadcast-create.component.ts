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
      this.broadcastService.initCreate(params["type"], params["parentId"]);
    })


    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        let uri = ev.urlAfterRedirects;
        this.currentTab = uri.substring(uri.lastIndexOf("/") + 1);
        switch (this.currentTab) {
          case 'types':
            this.broadcastService.currentStep = 1;
            break;
          case 'content':
            this.broadcastService.currentStep = 2;
            break;
          case 'members':
            this.broadcastService.currentStep = 3;
            break;
          case 'schedule':
            this.broadcastService.currentStep = 4;
            break;
        }
      }
    });
  }

}
