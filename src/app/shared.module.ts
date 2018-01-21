import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModuleWithProviders} from "@angular/compiler/src/core";
import {TranslateModule, TranslatePipe} from "@ngx-translate/core";
import {CreateTodoComponent} from "./groups/group-details/group-activity/create-todo/create-todo.component";
import {CreateVoteComponent} from "./groups/group-details/group-activity/create-vote/create-vote.component";
import {CreateMeetingComponent} from "./groups/group-details/group-activity/create-meeting/create-meeting.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {PaginationComponent} from "./pagination/pagination.component";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgbModule,
  ],
  declarations: [
    CreateMeetingComponent,
    CreateVoteComponent,
    CreateTodoComponent,
    PaginationComponent,
  ],
  entryComponents: [
    CreateMeetingComponent,
    CreateVoteComponent,
    CreateTodoComponent
  ],
  exports: [
    RouterModule, FormsModule, ReactiveFormsModule, TranslateModule,
    CreateMeetingComponent, CreateVoteComponent, CreateTodoComponent, PaginationComponent // todo: move into LoggedInShared
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        DatePipe,
        TranslatePipe
      ]
    }
  }
}
