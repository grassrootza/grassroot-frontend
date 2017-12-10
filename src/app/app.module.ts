import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Http, HttpModule, RequestOptions} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {GroupsComponent} from './groups/group-list/groups.component';
import {LoginComponent} from './login/login.component';
import {LoggedInGuard} from './logged-in.guard';
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {GroupService} from "./groups/group.service";
import {RegistrationComponent} from './registration/registration.component';
import {UserService} from "./user/user.service";
import {HomeComponent} from './home/home.component';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from "@angular/common";
import {GroupInfoComponent} from './groups/group-list-row/group-info.component';
import {GroupDetailsComponent} from './groups/group-details/group-details.component';
import {GroupMembersComponent} from "./groups/group-details/group-members/group-members.component";
import {GroupDashboardComponent} from "./groups/group-details/group-dashboard/group-dashboard.component";


const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {path: 'register', component: RegistrationComponent},
  {path: 'home', component: HomeComponent, canActivate: [LoggedInGuard]},
  {path: 'groups', component: GroupsComponent, canActivate: [LoggedInGuard]},
  {
    path: 'group/:id',
    component: GroupDetailsComponent,
    canActivate: [LoggedInGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: GroupDashboardComponent},
      {path: 'members', component: GroupMembersComponent}
    ]
  }
];

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
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
    GroupMembersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes) // <-- routes
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: APP_BASE_HREF, useValue: '/'},
    LoggedInGuard,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    GroupService,
    UserService
  ],
  bootstrap: [AppComponent]
})


export class AppModule {}

