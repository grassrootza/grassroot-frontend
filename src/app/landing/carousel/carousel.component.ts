import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
  ViewChild
} from '@angular/core';
// import { CarouselItemDirective } from './carousel-item.directive';
import {animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style} from '@angular/animations';
import {interval} from 'rxjs';
import {isPlatformBrowser} from "@angular/common";
import {PublicLivewire} from "../../livewire/public-livewire.model";

@Component({
  selector: 'carousel',
  exportAs: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css'],
})
export class CarouselComponent<T> implements AfterViewInit, OnChanges {
  @ViewChild('carousel') private carousel : ElementRef;
  @Input() timing = '800ms ease-in';
  @Input() durationBetweenScrolls: number = 2000;
  @Input() items: any[] = [];
  @Input() propertiesToDisplay: string[] = [];
  @Input() carouselContainerWidth: number;
  @Input() scrollDirection: string = 'left';
  private player : AnimationPlayer;
  private itemWidth : number;
  carouselWrapperStyle = {};
  carouselItemStyle = {};

  constructor(private builder : AnimationBuilder, @Inject(PLATFORM_ID) protected platformId: Object) {
  }

  ngAfterViewInit() {
    // For some reason only here I need to add setTimeout, in my local env it's working without this.

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['items'] && !changes['items'].firstChange) {
      if (isPlatformBrowser(this.platformId) && this.items && this.items.length > 1) {
        this.startAutoScroll();
      }
    }

    if (changes['carouselContainerWidth']) {
      this.setWidths();
    }
  }

  setWidths() {
    console.log("setting container width to: ", this.carouselContainerWidth);
    this.itemWidth = this.carouselContainerWidth;
    this.carouselWrapperStyle = {
      width: `${this.itemWidth}px`
    };

    const width = this.carouselContainerWidth;
    this.carouselItemStyle = {
      width: `${width}px`
    };
  }


  public left() {
    const offset = this.itemWidth;
    const myAnimation : AnimationFactory = this.buildAnimationNext(offset);
    this.player = myAnimation.create(this.carousel.nativeElement.children[0]);
    this.player.play();
    this.player.onDone(() => {
      let newArray = [];
      let firstElement = <PublicLivewire> this.items[0];
      let newElement = new PublicLivewire(firstElement.headline, firstElement.creationTimeMillis, firstElement.description, firstElement.imageKeys);
      this.items.shift();
      newArray = newArray.concat(this.items);
      newArray.push(newElement);
      this.items = newArray;
    });

  }

  right() {
    const offset = this.itemWidth;
    const myAnimation : AnimationFactory = this.buildAnimationPrev(offset);
    this.player = myAnimation.create(this.carousel.nativeElement.children[0]);
    this.player.play();
    this.player.onDone(() => {
      let lastElement = this.items.pop();
      let newElement = new PublicLivewire(lastElement.headline, lastElement.creationTimeMillis, lastElement.description, lastElement.imageKeys);
      let newArray = [];
      newArray.push(newElement);
      newArray = newArray.concat(this.items);
      this.items = newArray;
    });

  }

  private buildAnimationNext( offset ) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
    ]);
  }

  private buildAnimationPrev( offset ) {
    return this.builder.build([
      animate(this.timing, style({ transform: `translateX(+${offset}px)` }))
    ]);
  }



  private startAutoScroll() {
    console.log("starting auto scroll with interval: ", this.durationBetweenScrolls);
    interval(this.durationBetweenScrolls).subscribe(() => {
      if(this.scrollDirection === 'left')
        this.left();
      else
        this.right();
    });
  }

}
