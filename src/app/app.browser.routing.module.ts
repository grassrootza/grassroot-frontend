import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {NgModule} from '@angular/core';
import {JoinComponent} from './join/join.component';
import {PwdResetInitiateComponent} from "./login/password-reset/pwd-reset-initiate/pwd-reset-initiate.component";
import {PasswordResetComponent} from "./login/password-reset/password-reset.component";
import {GroupMembersImportComponent} from "./groups/group-details/group-members/group-members-import/group-members-import.component";
import {PwdResetValidateComponent} from "./login/password-reset/pwd-reset-validate/pwd-reset-validate.component";
import {LoggedInGuard} from "./logged-in.guard";
import {PwdResetNewComponent} from "./login/password-reset/pwd-reset-new/pwd-reset-new.component";
import {FileImportComponent} from "./groups/group-details/group-members/group-members-import/file-import/file-import.component";
import {IntegrationConnectComponent} from "./user/integrations/integration-connect/integration-connect.component";
import {LandingComponent} from "./landing/landing.component";

const routes: Routes = [

  // {path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [LoggedInGuard]},
  {path: 'landing', component: LandingComponent},
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
  {path: 'task', loadChildren: './task/task-details.module#TaskDetailsModule', canActivate:[LoggedInGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppBrowserRoutingModule {


}
