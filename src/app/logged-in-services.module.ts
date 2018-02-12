import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule} from "@angular/router";
import {ClipboardModule} from "ng2-clipboard";
import {CreateMeetingComponent} from "./groups/group-details/group-activity/create-meeting/create-meeting.component";
import {CreateVoteComponent} from "./groups/group-details/group-activity/create-vote/create-vote.component";
import {PaginationComponent} from "./pagination/pagination.component";
import {MemberFilterComponent} from "./groups/member-filter/member-filter.component";
import {CreateTodoComponent} from "./groups/group-details/group-activity/create-todo/create-todo.component";
import {GroupInfoComponent} from "./groups/group-list-row/group-info.component";
import {CreateGroupComponent} from "./groups/create-group/create-group.component";
import {ToDoRespondComponent} from "./task/todo-respond/todo-respond.component";

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
    CreateGroupComponent,
    CreateMeetingComponent,
    CreateVoteComponent,
    CreateTodoComponent,
    ToDoRespondComponent,
    PaginationComponent,
    MemberFilterComponent
  ],
  entryComponents: [
    GroupInfoComponent,
    CreateGroupComponent,
    CreateMeetingComponent,
    CreateVoteComponent,
    CreateTodoComponent,
    ToDoRespondComponent
  ],
  exports: [
    GroupInfoComponent, CreateGroupComponent, CreateMeetingComponent, CreateVoteComponent, CreateTodoComponent, ToDoRespondComponent,
    PaginationComponent, MemberFilterComponent
  ]
})
export class LoggedInServicesModule { }
