import {Component, Inject, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'app-terms-use',
  templateUrl: './terms-of-use.component.html',
  styleUrls: ['./static-matter-general.css']
})
export class TermsOfUseComponent{

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

}
