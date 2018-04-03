import {Component, Inject, OnInit, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-front-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: [ '../landing.component.css', './static-matter-general.css' ]
})
export class ContributeComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

}
