import {Routes} from "@angular/router";
import {BroadcastTypeComponent} from "./broadcast-create/broadcast-type/broadcast-type.component";
import {LoggedInGuard} from "../logged-in.guard";
import {BroadcastMembersComponent} from "./broadcast-create/broadcast-members/broadcast-members.component";
import {BroadcastScheduleComponent} from "./broadcast-create/broadcast-schedule/broadcast-schedule.component";
import {BroadcastContentComponent} from "./broadcast-create/broadcast-content/broadcast-content.component";
import {BroadcastWorkflowGuard} from "./broadcast-create/create-workflow-guard.guard";
import {BroadcastCreateComponent} from "./broadcast-create/broadcast-create.component";

export const BROADCAST_ROUTES: Routes = [
  {path: '', component: BroadcastCreateComponent, canActivate: [LoggedInGuard], children: [
      {path: '', redirectTo: 'types', pathMatch: 'full'},
      {path: 'types', component: BroadcastTypeComponent, canActivate: [LoggedInGuard]},
      {path: 'content', component: BroadcastContentComponent, canActivate: [LoggedInGuard, BroadcastWorkflowGuard]},
      {path: 'members', component: BroadcastMembersComponent, canActivate: [LoggedInGuard, BroadcastWorkflowGuard]},
      {path: 'schedule', component: BroadcastScheduleComponent, canActivate: [LoggedInGuard, BroadcastWorkflowGuard]}]
  }
];
