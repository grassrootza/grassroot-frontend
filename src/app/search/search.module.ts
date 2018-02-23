import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {LoggedInServicesModule} from "../logged-in-services.module";
import {GlobalSearchResultsComponent} from "./global-search-results/global-search-results.component";
import {LoggedInGuard} from "../logged-in.guard";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MyGroupsComponent} from "./global-search-results/my-groups/my-groups.component";
import {MyActivitiesComponent} from "./global-search-results/my-activities/my-activities.component";
import {MyCampaignsComponent} from "./global-search-results/my-campaigns/my-campaigns.component";
import {PublicMeetingsComponent} from "./global-search-results/public-meetings/public-meetings.component";
import {PublicGroupsComponent} from "./global-search-results/public-groups/public-groups.component";
import {ViewMeetingComponent} from "../view-task/view-meeting/view-meeting.component";
import {ViewTodoComponent} from "../view-task/view-todo/view-todo.component";
import {ViewVoteComponent} from "../view-task/view-vote/view-vote.component";
import {SharedModule} from "../shared.module";


export const SEARCH_ROUTE: Routes = [
  {path:'',component:GlobalSearchResultsComponent,canActivate:[LoggedInGuard],children:[
    {path:'',redirectTo:'my-activities',pathMatch:'full'},
    {path:'my-activities',component:MyActivitiesComponent,canActivate:[LoggedInGuard]},
    {path:'my-groups',component:MyGroupsComponent,canActivate:[LoggedInGuard]},
    {path:'my-campaigns',component:MyCampaignsComponent,canActivate:[LoggedInGuard]},
    {path:'public-meetings',component:PublicMeetingsComponent,canActivate:[LoggedInGuard]},
    {path:'public-groups',component:PublicGroupsComponent,canActivate:[LoggedInGuard]}
  ]}
];

@NgModule({
  imports: [
    CommonModule,
    LoggedInServicesModule,
    SharedModule,
    NgbModule,
    RouterModule.forChild(SEARCH_ROUTE)
  ],
  declarations: [
    GlobalSearchResultsComponent,
    MyActivitiesComponent,
    MyGroupsComponent,
    MyCampaignsComponent,
    PublicGroupsComponent,
    PublicMeetingsComponent,
    ViewTodoComponent
  ]
})
export class SearchModule { }
