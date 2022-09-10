import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LandingComponent} from './landing.component';
import {RouterModule, Routes} from "@angular/router";
import {SharedModule} from "../shared.module";
import {PublicActivityService} from "./public-activity.service";

export const LANDING_ROUTE: Routes = [
  {path: '', component: LandingComponent}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(LANDING_ROUTE),
  ],
  providers: [
    PublicActivityService
  ]
})
export class LandingModule { }
