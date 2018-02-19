import { Component, OnInit } from '@angular/core';
import {AlertService} from "../../utils/alert.service";

@Component({
  selector: 'app-global-search-results',
  templateUrl: './global-search-results.component.html',
  styleUrls: ['./global-search-results.component.css']
})
export class GlobalSearchResultsComponent implements OnInit {

  constructor(private alertService:AlertService) { }

  ngOnInit() {
    this.alertService.hideLoadingDelayed();
  }

}
