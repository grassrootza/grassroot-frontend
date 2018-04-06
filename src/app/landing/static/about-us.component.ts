import {Component, Inject, OnInit, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: [ '../landing.component.css', './static-matter-general.css' ]
})
export class AboutUsComponent implements OnInit {

  public teamList:string[] = [
    "Paballo Ditshego", "Tyler Smith", "Siyanda Mzam", "Lesetse Kimwaga", "Taher Moosa",
    "Vjeran Marcinko", "Igor Buzatovic", "Mato Stanic", "Charles Malebana",
    "Mamaisa Mbele",
    "Mondli Msani",
    "Zweli Vanyaza",
    "Phumlani Khulu",
    "Sibongile Mabitsela",
    "Maria Ditse",
    "Nyoni Mazibuko",
    "Rodney Seshoene",
    "Peter Nkomo",
    "Edwin Zvavashe",
    "Lucky Manyama",
    "Nontokozo Mthombeni",
    "Sbongakonke Ndawonde",
    "Thembani Zwane",
    "Sanele Mkhasibe"
  ];

  constructor(private route: ActivatedRoute, @Inject(PLATFORM_ID) protected platformId: Object) {
  }

  ngOnInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        this.scrollToElement(fragment);
      } else {
        console.log("no fragment");
        this.scrollToTop();
      }
    });

  }

  scrollToElement(section: string) {
    if (isPlatformBrowser(this.platformId)) {
      const timeOut = section === 'team' ? 0 : 300;
      const adjust = section === 'team' ? -75 : 0;
      setTimeout(() => {
        document.querySelector('#' + section).scrollIntoView(true);
        window.scrollBy(0, adjust);
      }, timeOut);
    }
  }

  scrollToTop() {
    if (isPlatformBrowser(this.platformId))
      window.scrollTo(0, 0);
  }

}
