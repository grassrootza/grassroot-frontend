import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from "@angular/router";
import {LoggedInServicesModule} from "../logged-in-services.module";
import {SharedModule} from "../shared.module";
import {ADMIN_ROUTES} from "./admin-routes";
import {AdminRoleGuard} from "./admin-role.guard";
import {SystemAdminComponent} from "./system-admin/system-admin.component";
import { AnalyticsComponent } from './analytics/analytics.component';
import { AnalyticsService } from './analytics.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminAccountsComponent } from './accounts/admin-accounts.component';
import { AccountsAdminService } from './admin-accounts.service';
import { AccountDetailComponent } from './accounts/account-detail/account-detail.component';
import { QuillModule } from "ngx-quill";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoggedInServicesModule,
    NgbModule,
    QuillModule,
    RouterModule.forChild(ADMIN_ROUTES)
  ],
  declarations: [
    SystemAdminComponent,
    AnalyticsComponent,
    AdminAccountsComponent,
    AccountDetailComponent
  ],
  providers: [
    AdminRoleGuard,
    AnalyticsService,
    AccountsAdminService
  ]
})
export class AdminModule {

}
