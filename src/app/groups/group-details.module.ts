import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {GROUP_DETAILS_ROUTES} from "./group-details-routes";
import {GroupDashboardComponent} from "./group-details/group-dashboard/group-dashboard.component";
import {GroupActivityComponent} from "./group-details/group-activity/group-activity.component";
import {GroupMembersComponent} from "./group-details/group-members/group-members.component";
import {GroupAllMembersComponent} from "./group-details/group-members/group-all-members/group-all-members.component";
import {GroupCustomFilterComponent} from "./group-details/group-members/group-custom-filter/group-custom-filter.component";
import {GroupMembersProfileComponent} from "./group-details/group-members/group-members-profile/group-members-profile.component";
import {GroupSettingsComponent} from "./group-details/group-settings/group-settings.component";
import {GroupTaskTeamsComponent} from "./group-details/group-members/group-task-teams/group-task-teams.component";
import {GroupDetailsComponent} from "./group-details/group-details.component";
import {GroupAddMemberComponent} from "./group-details/group-members/group-add-member/group-add-member.component";
import {MemberListComponent} from "./group-details/group-members/member-list/member-list.component";
import {Ng4LoadingSpinnerModule} from "ng4-loading-spinner";
import {GroupBroadcastComponent} from "./group-details/group-broadcast/group-broadcast.component";
import {CreateTaskTeamComponent} from "./group-details/group-members/group-task-teams/create-task-team/create-task-team.component";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    Ng4LoadingSpinnerModule,
    RouterModule.forChild(GROUP_DETAILS_ROUTES)
  ],
  declarations: [
    GroupDetailsComponent,
    GroupDashboardComponent,
    GroupActivityComponent,
    GroupBroadcastComponent,
    MemberListComponent,
    GroupMembersComponent,
    GroupAllMembersComponent,
    GroupTaskTeamsComponent,
    GroupCustomFilterComponent,
    GroupMembersProfileComponent,
    GroupSettingsComponent,
    GroupAddMemberComponent,
    CreateTaskTeamComponent
  ]
})
export class GroupDetailsModule {

}
