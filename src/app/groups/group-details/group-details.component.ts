import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit {


  public currentTab: string = "dashboard";

  constructor(private router: Router, ar: ActivatedRoute) {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.currentTab = ev.urlAfterRedirects.substring(ev.urlAfterRedirects.lastIndexOf("/") + 1);
      }
    });
  }

  ngOnInit() {
  }

}
