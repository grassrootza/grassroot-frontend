import {Routes} from "@angular/router";
import {LoggedInGuard} from "../logged-in.guard";
import {AdminRoleGuard} from "./admin-role.guard";
import {SystemAdminComponent} from "./system-admin/system-admin.component";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { AdminAccountsComponent } from "./accounts/admin-accounts.component";

export const ADMIN_ROUTES : Routes = [
    {path: '', component: SystemAdminComponent, canActivate: [LoggedInGuard, AdminRoleGuard],
      data: {roles: ['ROLE_SYSTEM_ADMIN']}},
    {path: 'analytics', component: AnalyticsComponent, canActivate: [LoggedInGuard, AdminRoleGuard],
      data: {roles: ['ROLE_SYSTEM_ADMIN']}},
    {path: 'accounts', component: AdminAccountsComponent, canActivate: [LoggedInGuard, AdminRoleGuard],
      data: {roles: ['ROLE_SYSTEM_ADMIN']}}
  ];
