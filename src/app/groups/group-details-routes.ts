import {RouterModule, Routes} from "@angular/router";
import {LoggedInGuard} from "../logged-in.guard";
import {GroupActivityComponent} from "./group-details/group-activity/group-activity.component";
import {GroupMembersComponent} from "./group-details/group-members/group-members.component";
import {GroupSettingsComponent} from "./group-details/group-settings/group-settings.component";
import {GroupDashboardComponent} from "./group-details/group-dashboard/group-dashboard.component";
import {GroupCustomFilterComponent} from "./group-details/group-members/group-custom-filter/group-custom-filter.component";
import {GroupAllMembersComponent} from "./group-details/group-members/group-all-members/group-all-members.component";
import {GroupMembersProfileComponent} from "./group-details/group-members/group-members-profile/group-members-profile.component";
import {GroupTaskTeamsComponent} from "./group-details/group-members/group-task-teams/group-task-teams.component";
import {GroupDetailsComponent} from "./group-details/group-details.component";
import {NgModule} from "@angular/core";
import {GroupBroadcastComponent} from "./group-details/group-broadcast/group-broadcast.component";

const GROUP_DETAILS_ROUTES: Routes = [
  {path: '', component: GroupDetailsComponent, canActivate: [LoggedInGuard], children: [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: GroupDashboardComponent, canActivate: [LoggedInGuard]},
    {path: 'activity', component: GroupActivityComponent, canActivate: [LoggedInGuard]},
    {path: 'broadcast', component: GroupBroadcastComponent, canActivate: [LoggedInGuard]},
    {
      path: 'members',
      component: GroupMembersComponent,
      canActivate: [LoggedInGuard],
      children: [
        {path: '', redirectTo: 'all', pathMatch: 'full'},
        {path: 'all', component: GroupAllMembersComponent, canActivate: [LoggedInGuard]},
        {path: 'task-teams', component: GroupTaskTeamsComponent, canActivate: [LoggedInGuard]},
        {path: 'filter', component: GroupCustomFilterComponent, canActivate: [LoggedInGuard]},
        {path: ':memberUid', component:GroupMembersProfileComponent, canActivate: [LoggedInGuard]}
      ]
    },
    {path: 'settings', component: GroupSettingsComponent, canActivate: [LoggedInGuard]}]
  }
];

@NgModule({
  imports: [RouterModule.forChild(GROUP_DETAILS_ROUTES)],
  exports: [RouterModule]
})
export class GroupDetailsRoutes {

}
