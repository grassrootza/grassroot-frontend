import { Component, Input } from '@angular/core';

/**
 * This component loads a background image in progressive way: 
 * inline svg -> low res image -> high res image
 */
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {

  @Input()
  lowResImagePath: string;

  @Input()
  highResImagePath: string;

  loadLowRes: boolean = true;
  loadHighRes: boolean = false;

  showLowRes = false;
  showHighRes = false;

  lowResLoaded() {
    this.showLowRes = true;
    this.loadHighRes = true;
  }

  highResLoaded() {
    this.showHighRes = true;
  }

  /**
   * Method called when the high end res finishes its revealing
   */
  highResTransitionEnd() {
    // remove the load res image from the DOM for better a11y (no duplicates)
    this.loadLowRes = false;
  }

}
