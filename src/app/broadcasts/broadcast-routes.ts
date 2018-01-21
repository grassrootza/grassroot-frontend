import {RouterModule, Routes} from "@angular/router";
import {BroadcastTypeComponent} from "./broadcast-create/broadcast-type/broadcast-type.component";
import {BroadcastMembersComponent} from "./broadcast-create/broadcast-members/broadcast-members.component";
import {BroadcastScheduleComponent} from "./broadcast-create/broadcast-schedule/broadcast-schedule.component";
import {BroadcastContentComponent} from "./broadcast-create/broadcast-content/broadcast-content.component";
import {BroadcastCreateComponent} from "./broadcast-create/broadcast-create.component";
import {LoggedInGuard} from "../logged-in.guard";
import {BroadcastWorkflowGuard} from "./broadcast-create/create-workflow-guard.guard";
import {NgModule} from "@angular/core";

const BROADCAST_ROUTES: Routes = [
  {path: '', component: BroadcastCreateComponent, children: [
      {path: '', redirectTo: 'types', pathMatch: 'full', canActivate: [LoggedInGuard, BroadcastWorkflowGuard]},
      {path: 'types', component: BroadcastTypeComponent, canActivate: [LoggedInGuard, BroadcastWorkflowGuard]},
      {path: 'content', component: BroadcastContentComponent, canActivate: [LoggedInGuard, BroadcastWorkflowGuard]},
      {path: 'members', component: BroadcastMembersComponent, canActivate: [LoggedInGuard, BroadcastWorkflowGuard]},
      {path: 'schedule', component: BroadcastScheduleComponent, canActivate: [LoggedInGuard, BroadcastWorkflowGuard]}]
  }
];

@NgModule({
  imports: [RouterModule.forChild(BROADCAST_ROUTES)],
  exports: [RouterModule]
})
export class BroadcastRoutes {
}
