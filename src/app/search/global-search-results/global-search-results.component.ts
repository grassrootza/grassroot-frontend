import {Component, OnInit} from '@angular/core';
import {AlertService} from "../../utils/alert.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-global-search-results',
  templateUrl: './global-search-results.component.html',
  styleUrls: ['./global-search-results.component.css']
})
export class GlobalSearchResultsComponent implements OnInit {

  public currentTab: string = "my-activities";

  constructor(private alertService:AlertService,
              private router: Router) {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        let uri = ev.urlAfterRedirects;
        this.currentTab = uri.substring(uri.lastIndexOf('/') + 1);
      }
    });
  }

  ngOnInit() {
    this.alertService.hideLoadingDelayed();
  }

  searchAgain(term: string) {
    this.router.navigate(["/search", term, this.currentTab]);
  }

}
