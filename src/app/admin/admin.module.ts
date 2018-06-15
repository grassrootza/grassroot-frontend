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
import {SubscriberComponent} from './livewire/accounts/view/subscriber/subscriber.component';
import {SystemAdminComponent} from "./system-admin/system-admin.component";
import { AnalyticsComponent } from './analytics/analytics.component';
import { AnalyticsService } from './analytics.service';

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
    SubscriberComponent,
    SystemAdminComponent,
    AnalyticsComponent
  ],
  providers: [
    AdminRoleGuard,
    LiveWireAdminService,
    AnalyticsService
  ]
})
export class AdminModule {

}
