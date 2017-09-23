import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Http, HttpModule, RequestOptions} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import {AppComponent} from './app.component';
import {GroupsComponent} from './groups/groups.component';
import {LoginComponent} from './login/login.component';
import {LoggedInGuard} from './logged-in.guard';
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {GroupService} from "./groups/group.service";
import {RegistrationComponent} from './registration/registration.component';
import {UserService} from "./user/user.service";
import {HomeComponent} from './home/home.component';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy} from "@angular/common";


const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {path: 'register', component: RegistrationComponent},
  {path: 'home', component: HomeComponent, canActivate: [LoggedInGuard]},
  {path: 'groups', component: GroupsComponent, canActivate: [LoggedInGuard]}
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
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
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

