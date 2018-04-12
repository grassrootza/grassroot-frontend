import {Routes} from "@angular/router";
import {LoggedInGuard} from "../logged-in.guard";
import {LiveWireListComponent} from "./livewire/alert-list/live-wire-list.component";
import {ViewAlertComponent} from "./livewire/alert-view/view-alert.component";
import {AdminRoleGuard} from "./admin-role.guard";

export const ADMIN_ROUTES : Routes = [
    {path: 'livewire/list', component: LiveWireListComponent, canActivate: [LoggedInGuard, AdminRoleGuard],
      data: {roles: ['ROLE_LIVEWIRE_USER']}},
    {path: 'livewire/:id', component: ViewAlertComponent, canActivate: [LoggedInGuard, AdminRoleGuard],
      data: {roles: ['ROLE_LIVEWIRE_USER']}},
  ];
