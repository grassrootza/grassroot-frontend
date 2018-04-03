import {Component, Inject, OnInit, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";

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

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {
  }

  ngOnInit() {
    // probably going to remove this since we'll consolidate sections
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }

}
