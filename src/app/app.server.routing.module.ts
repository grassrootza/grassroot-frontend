import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {LoadingScreenComponent} from './utils/loading-screen/loading-screen.component';
import {NgModule} from '@angular/core';
import {JoinComponent} from './landing/join/join.component';
import {RegistrationComponent} from './registration/registration.component';
import {NewsComponent} from "./livewire/news.component";
import {HomeScreenRoutingComponent} from "./landing/home-screen-routing.component";
import {UnsubscribeComponent} from "./landing/unsubscribe/unsubscribe.component";
import {FrontPageRespondComponent} from "./landing/respond/front-page-respond.component";
import {PrivacyPolicyComponent} from "./landing/static/privacy-policy.component";
import {TermsOfUseComponent} from "./landing/static/terms-of-use.component";
import {AboutUsComponent} from "./landing/static/about-us.component";
import {ContributeComponent} from "./landing/static/contribute.component";

// a bit of redundancy here, but small price to pay to avoid routing weirdness if use joint routes
const routes: Routes = [
  {path: '', component: HomeScreenRoutingComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegistrationComponent},
  {path: 'join/group/:groupId', component: JoinComponent},
  {path: 'news', component: NewsComponent},
  {path: 'unsubscribe/:groupId/:userId/:token', component: UnsubscribeComponent},
  {path: 'respond/:taskType/:taskId/:userId/:token', component: FrontPageRespondComponent},

  // bunch of routes for front matter
  {path: 'about', component: AboutUsComponent},
  {path: 'contribute', component: ContributeComponent},
  {path: 'contribute/success', component: ContributeComponent},

  {path: 'privacy', component: PrivacyPolicyComponent},
  {path: 'terms', component: TermsOfUseComponent},

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
