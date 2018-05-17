import {Routes} from "@angular/router";
import {LoggedInGuard} from "../logged-in.guard";
import {LiveWireListComponent} from "./livewire/alert-list/live-wire-list.component";
import {ViewAlertComponent} from "./livewire/alert-view/view-alert.component";
import {AdminRoleGuard} from "./admin-role.guard";
import { SubscriberComponent } from "./livewire/accounts/view/subscriber/subscriber.component";
import {SystemAdminComponent} from "./system-admin/system-admin.component";

export const ADMIN_ROUTES : Routes = [
    {path: '', component: SystemAdminComponent, canActivate: [LoggedInGuard, AdminRoleGuard],
      data: {roles: ['ROLE_SYSTEM_ADMIN']}},
    {path: 'livewire/list', component: LiveWireListComponent, canActivate: [LoggedInGuard, AdminRoleGuard],
      data: {roles: ['ROLE_LIVEWIRE_USER']}},
    {path: 'livewire/alert/:id', component: ViewAlertComponent, canActivate: [LoggedInGuard, AdminRoleGuard],
      data: {roles: ['ROLE_LIVEWIRE_USER']}},
    {path: 'livewire/subscriber/:id',component: SubscriberComponent, canActivate: [LoggedInGuard,AdminRoleGuard],
      data: {roles: ['ROLE_SYSTEM_ADMIN']}}
  ];
