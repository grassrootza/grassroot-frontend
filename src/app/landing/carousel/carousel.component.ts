import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import {isPlatformBrowser} from "@angular/common";
import {PublicLivewire} from "../../livewire/public-livewire.model";

@Component({
  selector: 'carousel',
  exportAs: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent implements OnChanges {
  @ViewChild('carousel') private carousel : ElementRef;
  @Input() timing = '800ms ease-in';
  @Input() durationBetweenScrolls: number = 2000;

  @Input() propertiesToDisplay: string[] = [];
  @Input() scrollDirection: string = 'left';

  @Input() items: PublicLivewire[] = [];

  carouselWrapperStyle = {};
  carouselItemStyle = {};
  moveCarousel: boolean;

  currentItemIdx: number = 0;
  scrollTimeout: any;

  /**
   * Represents the current 2 items that are showcased in the carousel. The carousel will
   * transition from the first to the second one and then replace them for the next set of 2.
   */
  currentItems: PublicLivewire[] = [];

  constructor(
    @Inject(PLATFORM_ID) protected platformId: Object) {
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['items'];
    if (change) {
      let items = change.currentValue as PublicLivewire[];
      // console.log('LiveWire items: ', items);
      this.currentItems = items.slice(0, 2);
      this.currentItemIdx = 0;
      if (isPlatformBrowser(this.platformId) &&
          this.currentItems &&
          this.currentItems.length > 1 &&
          !this.scrollTimeout) {
        this.scrollCarousel();
      }
    }
  }

  /**
   * Listener called when the carousel has finished a translate transition.
   */
  onCarouselTransitionEnd() {
    this.currentItemIdx++;
    if (this.currentItemIdx === this.items.length - 1) {
      this.currentItemIdx = -1; // -1 represents the last element of the next batch
    }
    this.currentItems.shift();
    this.currentItems.push(this.items[this.currentItemIdx + 1]);
    this.moveCarousel = false;
    this.scrollCarousel();
  }

  /**
   * Animates the carousel
   */
  scrollCarousel() {
    if (this.currentItems.length > 1) {
      this.scrollTimeout = setTimeout(() => {
        this.moveCarousel = true;
      }, this.durationBetweenScrolls);
    }
  }

}
