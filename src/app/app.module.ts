import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';

import {AppComponent} from './app.component';
import {GroupsComponent} from './groups/group-list/groups.component';
import {LoginComponent} from './login/login.component';
import {LoggedInGuard} from './logged-in.guard';
import {GroupService} from "./groups/group.service";
import {RegistrationComponent} from './registration/registration.component';
import {UserService} from "./user/user.service";
import {HomeComponent} from './home/home.component';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {GroupInfoComponent} from './groups/group-list-row/group-info.component';
import {GroupDetailsComponent} from './groups/group-details/group-details.component';
import {GroupMembersComponent} from "./groups/group-details/group-members/group-members.component";
import {GroupDashboardComponent} from "./groups/group-details/group-dashboard/group-dashboard.component";
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {GroupActivityComponent} from './groups/group-details/group-activity/group-activity.component';
import {GroupBroadcastComponent} from './groups/group-details/group-broadcast/group-broadcast.component';
import {GroupSettingsComponent} from './groups/group-details/group-settings/group-settings.component';
import {TaskService} from "./task/task.service";
import {JwtModule} from "@auth0/angular-jwt";
import {GroupAllMembersComponent} from './groups/group-details/group-members/group-all-members/group-all-members.component';
import {GroupTaskTeamsComponent} from './groups/group-details/group-members/group-task-teams/group-task-teams.component';
import {GroupCustomFilterComponent} from './groups/group-details/group-members/group-custom-filter/group-custom-filter.component';
import {MemberListComponent} from './groups/group-details/group-members/member-list/member-list.component';
import {PaginationComponent} from './pagination/pagination.component';
import { GroupMembersImportComponent } from './groups/group-details/group-members/group-members-import/group-members-import.component';
import { FileImportComponent } from './groups/group-details/group-members/group-members-import/file-import/file-import.component';
import { GoogleImportComponent } from './groups/group-details/group-members/group-members-import/google-import/google-import.component';
import { TwitterImportComponent } from './groups/group-details/group-members/group-members-import/twitter-import/twitter-import.component';
import { FacebookImportComponent } from './groups/group-details/group-members/group-members-import/facebook-import/facebook-import.component';
import { CampaignsComponent } from './campaigns/campaign-list/campaigns.component';
import {CampaignService} from "./campaigns/campaign.service";
import { CampaignInfoComponent } from './campaigns/campaign-list-row/campaign-info.component';
import { CampaignCreateComponent } from './campaigns/campaign-create/campaign-create.component';


const routes: Routes = [

  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'home', component: HomeComponent, canActivate: [LoggedInGuard]},
  {path: 'groups', component: GroupsComponent, canActivate: [LoggedInGuard]},
  {
    path: 'group/:id',
    component: GroupDetailsComponent,
    canActivate: [LoggedInGuard],
    children: [
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
        ]
      },
      {path: 'settings', component: GroupSettingsComponent, canActivate: [LoggedInGuard]}
    ]
  },{
    path: 'group/import/:id', component: GroupMembersImportComponent, canActivate: [LoggedInGuard],
    children:[
      {path: '', redirectTo: 'file', pathMatch: 'full'},
      {path: 'file', component: FileImportComponent, canActivate: [LoggedInGuard]},
      {path: 'google', component: GoogleImportComponent, canActivate: [LoggedInGuard]},
      {path: 'twitter', component: TwitterImportComponent, canActivate: [LoggedInGuard]},
      {path: 'facebook', component: GoogleImportComponent, canActivate: [LoggedInGuard]},
    ]
  },
  {path: 'campaigns', component: CampaignsComponent, canActivate: [LoggedInGuard]},
  {path: 'campaigns/create', component: CampaignCreateComponent, canActivate: [LoggedInGuard]}
];



export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    GroupsComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    GroupInfoComponent,
    GroupDetailsComponent,
    GroupDashboardComponent,
    GroupMembersComponent,
    GroupActivityComponent,
    GroupBroadcastComponent,
    GroupSettingsComponent,
    GroupAllMembersComponent,
    GroupTaskTeamsComponent,
    GroupCustomFilterComponent,
    MemberListComponent,
    PaginationComponent,
    GroupMembersImportComponent,
    FileImportComponent,
    GoogleImportComponent,
    TwitterImportComponent,
    FacebookImportComponent,
    CampaignsComponent,
    CampaignInfoComponent,
    CampaignCreateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng4LoadingSpinnerModule,
    RouterModule.forRoot(routes), // <-- routes
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:8080']
      }
    })
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: APP_BASE_HREF, useValue: '/'},
    LoggedInGuard,
    GroupService,
    UserService,
    TaskService,
    CampaignService
  ],
  bootstrap: [AppComponent]
})


export class AppModule {}

