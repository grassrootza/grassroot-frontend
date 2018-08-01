import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {GroupBroadcastComponent} from "./group-details/group-broadcast/group-broadcast.component";
import {CreateTaskTeamComponent} from "./group-details/group-members/group-task-teams/create-task-team/create-task-team.component";
import {AddToTaskTeamComponent} from "./group-details/group-members/group-task-teams/add-to-task-team/add-to-task-team.component";
import {RouterModule} from "@angular/router";
import {LoggedInServicesModule} from "../logged-in-services.module";
import {SharedModule} from "../shared.module";
import {MemberTopicsManageComponent} from "./group-details/group-members/member-topics-manage/member-topics-manage.component";
import {GroupCopyMembersComponent} from "./group-details/group-members/group-copy-members/group-copy-members.component";
import {GroupInboundMessagesComponent} from "./group-details/group-inbound-messages/group-inbound-messages.component";
import { ClipboardModule } from 'ngx-clipboard';
import { GroupJoinMethodsComponent } from './group-details/group-join-methods/group-join-methods.component';
import { GroupJoinWordRowComponent } from './group-details/group-join-methods/join-word-row.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoggedInServicesModule,
    NgbModule,
    ClipboardModule,
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
    CreateTaskTeamComponent,
    AddToTaskTeamComponent,
    MemberTopicsManageComponent,
    GroupCopyMembersComponent,
    GroupInboundMessagesComponent,
    GroupJoinMethodsComponent,
    GroupJoinWordRowComponent
  ]
})
export class GroupDetailsModule {

}
