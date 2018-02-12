import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LoggedInGuard} from "../logged-in.guard";
import {GroupsComponent} from "./group-list/groups.component";
import {LoggedInServicesModule} from "../logged-in-services.module";
import {SharedModule} from "../shared.module";

export const GROUP_ROUTE: Routes = [
  {path: '', component: GroupsComponent, canActivate: [LoggedInGuard]}
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoggedInServicesModule,
    RouterModule.forChild(GROUP_ROUTE)
  ],
  declarations: [
    GroupsComponent
  ]
})
export class GroupsModule { }
