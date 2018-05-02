import {Routes} from "@angular/router";
import {LoggedInGuard} from "../logged-in.guard";
import {LiveWireListComponent} from "./livewire/alert-list/live-wire-list.component";
import {ViewAlertComponent} from "./livewire/alert-view/view-alert.component";
import {AdminRoleGuard} from "./admin-role.guard";
import { AccountsComponent } from "./livewire/accounts/accounts.component";
import { ViewSubscriberComponent } from "./livewire/accounts/view-subscriber/view-subscriber/view-subscriber.component";

export const ADMIN_ROUTES : Routes = [
    {path: 'livewire/list', component: LiveWireListComponent, canActivate: [LoggedInGuard, AdminRoleGuard],
      data: {roles: ['ROLE_LIVEWIRE_USER']}},
    {path: 'livewire/:id', component: ViewAlertComponent, canActivate: [LoggedInGuard, AdminRoleGuard],
      data: {roles: ['ROLE_LIVEWIRE_USER']}},
    {path: 'livewire-accounts',component:AccountsComponent, canActivate: [LoggedInGuard, AdminRoleGuard],
      data: {roles: ['ROLE_LIVEWIRE_USER']}},
    {path: 'view-subscriber/:id',component: ViewSubscriberComponent, canActivate: [LoggedInGuard,AdminRoleGuard],
      data: {roles: ['ROLE_LIVEWIRE_USER']}}
  ];
