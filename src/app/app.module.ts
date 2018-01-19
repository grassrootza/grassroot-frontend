import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Ng4LoadingSpinnerModule} from 'ng4-loading-spinner';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {GroupsComponent} from './groups/group-list/groups.component';
import {LoginComponent} from './login/login.component';
import {LoggedInGuard} from './logged-in.guard';
import {GroupService} from "./groups/group.service";
import {RegistrationComponent} from './registration/registration.component';
import {UserService} from "./user/user.service";
import {HomeComponent} from './home/home.component';
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from "@angular/common";
import {GroupInfoComponent} from './groups/group-list-row/group-info.component';
import {GroupDetailsComponent} from './groups/group-details/group-details.component';
import {GroupMembersComponent} from "./groups/group-details/group-members/group-members.component";
import {GroupDashboardComponent} from "./groups/group-details/group-dashboard/group-dashboard.component";
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
import {GroupMembersImportComponent} from './groups/group-details/group-members/group-members-import/group-members-import.component';
import {FileImportComponent} from './groups/group-details/group-members/group-members-import/file-import/file-import.component';
import {GoogleImportComponent} from './groups/group-details/group-members/group-members-import/google-import/google-import.component';
import {TwitterImportComponent} from './groups/group-details/group-members/group-members-import/twitter-import/twitter-import.component';
import {FacebookImportComponent} from './groups/group-details/group-members/group-members-import/facebook-import/facebook-import.component';
import {IntegrationsComponent} from './user/integrations/integrations.component';
import {IntegrationsService} from "./user/integrations/integrations.service";
import {IntegrationConnectComponent} from './user/integrations/integration-connect/integration-connect.component';
import {JoinComponent} from './join/join.component';
import {JoinService} from "./join/join.service";
import {UserProfileComponent} from './user/profile-container/user-profile.component';
import {ProfileFormComponent} from './user/profile-form/profile-form.component';
import {PasswordComponent} from './user/password/password.component';
import {AlertService} from "./utils/alert.service";
import {AccountComponent} from './user/account/account.component';
import {CreateMeetingComponent} from './groups/group-details/group-activity/create-meeting/create-meeting.component';
import {CreateVoteComponent} from './groups/group-details/group-activity/create-vote/create-vote.component';
import {CreateTodoComponent} from './groups/group-details/group-activity/create-todo/create-todo.component';
import {CreateGroupComponent} from './groups/create-group/create-group.component';
import {ToDoRespondComponent} from './task/todo-respond/todo-respond.component';
import {ClipboardModule} from 'ngx-clipboard';
import {PwdResetInitiateComponent} from './login/password-reset/pwd-reset-initiate/pwd-reset-initiate.component';
import {PwdResetValidateComponent} from './login/password-reset/pwd-reset-validate/pwd-reset-validate.component';
import {PwdResetNewComponent} from './login/password-reset/pwd-reset-new/pwd-reset-new.component';
import {PasswordResetComponent} from './login/password-reset/password-reset.component';
import {PasswordResetService} from "./login/password-reset/password-reset.service";
import {GroupAddMemberComponent} from './groups/group-details/group-members/group-add-member/group-add-member.component';
import {GroupMembersProfileComponent} from './groups/group-details/group-members/group-members-profile/group-members-profile.component';
import {SharedModule} from "./shared.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

export function getJwtToken(): string {
  return localStorage.getItem('token');
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

const routes: Routes = [

  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'join/:groupId/:code', component: JoinComponent},
  {path: 'forgot', component: PasswordResetComponent,
    children: [
      {path: '', redirectTo: 'initiate', pathMatch: 'full'},
      {path: 'initiate', component: PwdResetInitiateComponent},
      {path: 'validate', component: PwdResetValidateComponent},
      {path: 'reset', component: PwdResetNewComponent}
    ]},
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
          {path: ':memberUid', component:GroupMembersProfileComponent, canActivate: [LoggedInGuard]}
        ]
      },
      {path: 'settings', component: GroupSettingsComponent, canActivate: [LoggedInGuard]}
    ]
  },
  {
    path: 'group/import/:id', component: GroupMembersImportComponent, canActivate: [LoggedInGuard],
    children:[
      {path: '', redirectTo: 'file', pathMatch: 'full'},
      {path: 'file', component: FileImportComponent, canActivate: [LoggedInGuard]},
      {path: 'google', component: GoogleImportComponent, canActivate: [LoggedInGuard]},
      {path: 'twitter', component: TwitterImportComponent, canActivate: [LoggedInGuard]},
      {path: 'facebook', component: GoogleImportComponent, canActivate: [LoggedInGuard]},
    ]
  },
  {
    path: 'campaigns', loadChildren: './campaigns/campaigns.module#CampaignsModule', canActivate: [LoggedInGuard],
  },
  {
    path: 'broadcast/create/:type/:parentId',
      loadChildren: './broadcasts/broadcasts.module#BroadcastsModule', canActivateChild: [LoggedInGuard]
  },
  {path: 'user', component: UserProfileComponent, canActivate: [LoggedInGuard],
    children: [
      {path: '', redirectTo: 'profile', pathMatch: 'full'},
      {path: 'profile', component: ProfileFormComponent, canActivate: [LoggedInGuard]},
      {path: 'password', component: PasswordComponent, canActivate: [LoggedInGuard]},
      {path: 'account', component: AccountComponent, canActivate: [LoggedInGuard]},
      {path: 'integrations', component: IntegrationsComponent, canActivate: [LoggedInGuard]},
  ]},
  {path: 'social/connect/:providerId', component: IntegrationConnectComponent, canActivate: [LoggedInGuard]}
];

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
    IntegrationsComponent,
    IntegrationConnectComponent,
    UserProfileComponent,
    ProfileFormComponent,
    JoinComponent,
    PasswordComponent,
    AccountComponent,
    CreateMeetingComponent,
    CreateVoteComponent,
    CreateTodoComponent,
    CreateGroupComponent,
    ToDoRespondComponent,
    PwdResetInitiateComponent,
    PwdResetValidateComponent,
    PwdResetNewComponent,
    PasswordResetComponent,
    GroupAddMemberComponent,
    GroupMembersProfileComponent
  ],
  entryComponents: [
    CreateMeetingComponent,
    CreateVoteComponent,
    CreateTodoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Ng4LoadingSpinnerModule,
    ClipboardModule,
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
        headerName: 'Authorization',
        authScheme: 'Bearer ',
        tokenGetter: getJwtToken,
        whitelistedDomains: ['localhost:8080', 'staging.grassroot.org.za', 'app.grassroot.org.za']
      }
    }),
    NgbModule.forRoot(),
    SharedModule.forRoot()
  ],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: APP_BASE_HREF, useValue: '/'},
    LoggedInGuard,
    AlertService,
    GroupService,
    UserService,
    JoinService,
    IntegrationsService,
    TaskService,
    PasswordResetService
  ],
  bootstrap: [AppComponent]
})


export class AppModule {}

