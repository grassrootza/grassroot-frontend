import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {LoggedInGuard} from './logged-in.guard';
import {GroupService} from "./groups/group.service";
import {RegistrationComponent} from './registration/registration.component';
import {UserService} from "./user/user.service";
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from "@angular/common";
import {TaskService} from "./task/task.service";
import {JwtModule} from "@auth0/angular-jwt";
import {GroupMembersImportComponent} from './groups/group-details/group-members/group-members-import/group-members-import.component';
import {FileImportComponent} from './groups/group-details/group-members/group-members-import/file-import/file-import.component';
import {IntegrationsService} from "./user/integrations/integrations.service";
import {IntegrationConnectComponent} from './user/integrations/integration-connect/integration-connect.component';
import {JoinComponent} from './join/join.component';
import {JoinService} from "./join/join.service";
import {AlertService} from "./utils/alert.service";
import {PwdResetInitiateComponent} from './login/password-reset/pwd-reset-initiate/pwd-reset-initiate.component';
import {PwdResetValidateComponent} from './login/password-reset/pwd-reset-validate/pwd-reset-validate.component';
import {PwdResetNewComponent} from './login/password-reset/pwd-reset-new/pwd-reset-new.component';
import {PasswordResetComponent} from './login/password-reset/password-reset.component';
import {PasswordResetService} from "./login/password-reset/password-reset.service";
import {SharedModule} from "./shared.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {NotificationService} from "./user/notification.service";
import {CampaignService} from "./campaigns/campaign.service";
import {BroadcastService} from "./broadcasts/broadcast.service";
import { LiveWireAlertService } from "./livewire/live-wire-alert.service";
import {ANIMATION_TYPES, LoadingModule} from "ngx-loading";
import {AccountService} from "./user/account.service";
import {SearchService} from "./search/search.service";
import {MeetingDetailsComponent} from "./task/meeting-details/meeting-details.component";
import {LoggedInServicesModule} from "./logged-in-services.module";
import {MediaService} from "./media/media.service";
import { LiveWireListComponent } from './livewire/live-wire-list/live-wire-list.component';
import { ViewAlertComponent } from './livewire/view-alert/view-alert.component';

export function getJwtToken(): string {
  return localStorage.getItem('token');
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

const routes: Routes = [

  {path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [LoggedInGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'join/group/:groupId', component: JoinComponent},
  {path: 'forgot', component: PasswordResetComponent,
    children: [
      {path: '', redirectTo: 'initiate', pathMatch: 'full'},
      {path: 'initiate', component: PwdResetInitiateComponent},
      {path: 'validate', component: PwdResetValidateComponent},
      {path: 'reset', component: PwdResetNewComponent}
    ]},
  {path: 'home', loadChildren: './home/home.module#HomeModule', canActivate: [LoggedInGuard]},
  {path: 'groups', loadChildren: './groups/groups.module#GroupsModule', canActivate: [LoggedInGuard]},
  {
    path: 'group/:id', loadChildren: './groups/group-details.module#GroupDetailsModule', canActivate: [LoggedInGuard]
  },
  {
    path: 'group/import/:id', component: GroupMembersImportComponent, canActivate: [LoggedInGuard],
    children:[
      {path: '', redirectTo: 'file', pathMatch: 'full'},
      {path: 'file', component: FileImportComponent, canActivate: [LoggedInGuard]},
    ]
  },
  {
    path: 'campaigns', loadChildren: './campaigns/campaigns.module#CampaignsModule', canActivate: [LoggedInGuard],
  },
  {
    path: 'campaign/:id', loadChildren: './campaigns/campaign-dashboard.module#CampaignDashboardModule', canActivate: [LoggedInGuard]
  },
  {
    path: 'broadcast/create/:type/:parentId',
      loadChildren: './broadcasts/broadcasts.module#BroadcastsModule', canActivate: [LoggedInGuard]
  },
  {
    path: 'user', loadChildren: './user/user-profile.module#UserProfileModule', canActivate: [LoggedInGuard]
  },
  {path: 'social/connect/:providerId', component: IntegrationConnectComponent, canActivate: [LoggedInGuard]},
  {path: 'search/:searchTerm',loadChildren:'./search/search.module#SearchModule',canActivate:[LoggedInGuard]},
  {path: 'meeting/:id', component:MeetingDetailsComponent, canActivate:[LoggedInGuard]},
  {path: 'livewire',component:LiveWireListComponent,canActivate:[LoggedInGuard]},
  {path: 'view-alert/:id',component:ViewAlertComponent,canActivate:[LoggedInGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    GroupMembersImportComponent,
    FileImportComponent,
    IntegrationConnectComponent,
    JoinComponent,
    PwdResetInitiateComponent,
    PwdResetValidateComponent,
    PwdResetNewComponent,
    PasswordResetComponent,
    MeetingDetailsComponent,
    LiveWireListComponent,
    ViewAlertComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LoggedInServicesModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.circleSwish, backdropBackgroundColour: 'rgba(0,0,0,0.2)',
        backdropBorderRadius: '4px', primaryColour: '#26A041', secondaryColour: '#2CBC4C'}
      ),
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
    CampaignService,
    BroadcastService,
    UserService,
    NotificationService,
    JoinService,
    IntegrationsService,
    TaskService,
    PasswordResetService,
    AccountService,
    SearchService,
    MediaService,
    LiveWireAlertService
  ],
  bootstrap: [AppComponent]
})


export class AppModule {}

