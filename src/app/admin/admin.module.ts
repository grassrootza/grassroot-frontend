import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {LoggedInServicesModule} from "../logged-in-services.module";
import {SharedModule} from "../shared.module";
import {ADMIN_ROUTES} from "./admin-routes";
import {LiveWireAdminService} from "./livewire/livewire-admin-service";
import {LiveWireListComponent} from "./livewire/alert-list/live-wire-list.component";
import {ViewAlertComponent} from "./livewire/alert-view/view-alert.component";
import {AdminRoleGuard} from "./admin-role.guard";
import { AccountsComponent } from './livewire/accounts/accounts.component';
import { ViewSubscriberComponent } from './livewire/accounts/view-subscriber/view-subscriber/view-subscriber.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoggedInServicesModule,
    RouterModule.forChild(ADMIN_ROUTES)
  ],
  declarations: [
    LiveWireListComponent,
    ViewAlertComponent,
    AccountsComponent,
    ViewSubscriberComponent
  ],
  providers: [
    AdminRoleGuard,
    LiveWireAdminService
  ]
})
export class AdminModule {

}
