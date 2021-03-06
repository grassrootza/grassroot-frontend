import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LoggedInGuard} from "../logged-in.guard";
import {MeetingDetailsComponent} from "./meeting-details/meeting-details.component";
import {TodoDetailsComponent} from "./todo-details/todo-details.component";
import {LoggedInServicesModule} from "../logged-in-services.module";
import {SharedModule} from "../shared.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditVoteComponent } from './edit-vote/edit-vote.component';

export const TASK_DETAILS_ROUTES: Routes = [
  {path:'meeting/:id', component: MeetingDetailsComponent,canActivate:[LoggedInGuard]},
  {path:'todo/:id', component: TodoDetailsComponent, canActivate:[LoggedInGuard]},
  {path:'vote/:id', component: EditVoteComponent, canActivate:[LoggedInGuard]}
];

@NgModule({
  imports: [
    CommonModule,
    LoggedInServicesModule,
    SharedModule,
    NgbModule,
    RouterModule.forChild(TASK_DETAILS_ROUTES)
  ],
  declarations: [
    MeetingDetailsComponent,
    TodoDetailsComponent,
    EditVoteComponent
  ]
})
export class TaskDetailsModule { }
