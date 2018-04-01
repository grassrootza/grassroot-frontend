import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {LoadingScreenComponent} from './utils/loading-screen/loading-screen.component';
import {NgModule} from '@angular/core';
import {JoinComponent} from './landing/join/join.component';
import {RegistrationComponent} from './registration/registration.component';
import {LandingComponent} from "./landing/landing.component";
import {NewsComponent} from "./livewire/news.component";
import {HomeScreenRoutingComponent} from "./landing/home-screen-routing.component";

// a bit of redundancy here, but small price to pay to avoid routing weirdness if use joint routes
const routes: Routes = [
  {path: '', component: HomeScreenRoutingComponent},
  {path: 'about', component: LandingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'join/group/:groupId', component: JoinComponent},
  {path: 'news', component: NewsComponent},
  // directs all other routes to the main page
  {path: '**', component: LoadingScreenComponent}
];

@NgModule({
  // as default we set the desktop routing configuration. if mobile will be started it will be replaced below.
  // note that we must specify some routes here (not an empty array) otherwise the trick below doesn't work...
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppServerRoutingModule {


}
