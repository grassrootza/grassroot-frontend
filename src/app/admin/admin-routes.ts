import {Routes} from "@angular/router";
import {LoggedInGuard} from "../logged-in.guard";
import {LiveWireListComponent} from "./livewire/alert-list/live-wire-list.component";
import {ViewAlertComponent} from "./livewire/alert-view/view-alert.component";

export const ADMIN_ROUTES : Routes = [
    {path: 'livewire/list', component: LiveWireListComponent, canActivate: [LoggedInGuard]},
    {path: 'livewire/:id', component: ViewAlertComponent, canActivate: [LoggedInGuard]},
  ];
