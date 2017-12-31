import { Component, OnInit } from '@angular/core';
import {BroadcastService} from "../broadcast.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-broadcast-create',
  templateUrl: './broadcast-create.component.html',
  styleUrls: ['./broadcast-create.component.css']
})
export class BroadcastCreateComponent implements OnInit {

  constructor(private route: ActivatedRoute, private broadcastService: BroadcastService) { }

  ngOnInit() {
    console.log("Initiating new subscribe flow");
    this.route.params.subscribe(params => {
      console.log("got the parameters: ", params);
      this.broadcastService.initCreate(params["type"], params["parentId"]);
    })
  }

}
