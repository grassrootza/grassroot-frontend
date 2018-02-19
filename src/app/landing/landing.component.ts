import { Component, OnInit } from '@angular/core';
import {AlertService} from "../utils/alert.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.hideLoadingDelayed();
  }

}
