import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoggedInServicesModule} from "../logged-in-services.module";
import {HomeComponent} from "./home.component";
import {RouterModule, Routes} from "@angular/router";
import {LoggedInGuard} from "../logged-in.guard";
import {SharedModule} from "../shared.module";

export const HOME_ROUTE: Routes = [
  {path: '', component: HomeComponent, canActivate: [LoggedInGuard]}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoggedInServicesModule,
    RouterModule.forChild(HOME_ROUTE)
  ],
  declarations: [
    HomeComponent
  ]
})
export class HomeModule { }

