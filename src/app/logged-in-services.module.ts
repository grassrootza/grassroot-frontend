import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {ClipboardModule} from "ng2-clipboard";
import {CreateMeetingComponent} from "./task/create-meeting/create-meeting.component";
import {CreateVoteComponent} from "./task/create-vote/create-vote.component";
import {PaginationComponent} from "./pagination/pagination.component";
import {MemberFilterComponent} from "./groups/member-filter/member-filter.component";
import {CreateTodoComponent} from "./task/create-todo/create-todo.component";
import {GroupInfoComponent} from "./groups/group-list-row/group-info.component";
import {CreateGroupComponent} from "./groups/create-group/create-group.component";
import {CreateLivewireComponent} from "./livewire/create-livewire/create-livewire.component";
import {ViewMeetingComponent} from "./task/view-meeting/view-meeting.component";
import {ViewVoteComponent} from "./task/view-vote/view-vote.component";
import {CampaignInfoComponent} from "./campaigns/campaign-list/campaign-list-row/campaign-info.component";
import {MeetingResponsesComponent} from "./task/meeting-details/meeting-responses.component";
import {ViewTodoComponent} from "./task/view-todo/view-todo.component";
import {LivewireUserService} from "./livewire/livewire-user-service";
import { BroadcastListingComponent } from './broadcast/broadcast-listing/broadcast-listing.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
    ClipboardModule
  ],
  declarations: [
    GroupInfoComponent,
    CampaignInfoComponent,
    CreateGroupComponent,
    CreateMeetingComponent,
    CreateVoteComponent,
    CreateTodoComponent,
    CreateLivewireComponent,
    ViewTodoComponent,
    ViewMeetingComponent,
    ViewVoteComponent,
    MeetingResponsesComponent,
    PaginationComponent,
    MemberFilterComponent,
    BroadcastListingComponent
  ],
  entryComponents: [
    GroupInfoComponent,
    CampaignInfoComponent,
    CreateGroupComponent,
    CreateMeetingComponent,
    CreateVoteComponent,
    CreateTodoComponent,
    CreateLivewireComponent,
    ViewTodoComponent,
    ViewMeetingComponent,
    ViewVoteComponent,
    MeetingResponsesComponent
  ],
  providers: [
    LivewireUserService
  ],
  exports: [
    GroupInfoComponent, CampaignInfoComponent, BroadcastListingComponent,
    CreateGroupComponent, CreateMeetingComponent, CreateVoteComponent, CreateTodoComponent, CreateLivewireComponent,
    ViewTodoComponent, ViewMeetingComponent, ViewVoteComponent, MeetingResponsesComponent, PaginationComponent, MemberFilterComponent
  ]
})
export class LoggedInServicesModule { }
