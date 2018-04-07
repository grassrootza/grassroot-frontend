import {Component, Inject, OnInit, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./static-matter-general.css']
})
export class PrivacyPolicyComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

}
