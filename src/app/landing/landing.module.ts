import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { CarouselComponent } from './carousel/carousel.component';
import {LandingComponent} from './landing.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../shared.module";
import {PublicActivityService} from "./public-activity.service";
import {PublicNewsService} from "./public-news.service";

export const LANDING_ROUTE: Routes = [
  {path: '', component: LandingComponent}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(LANDING_ROUTE),
  ],
  declarations: [LandingComponent,
    CarouselComponent],
  providers: [
    PublicActivityService,
    PublicNewsService
  ]
})
export class LandingModule { }
