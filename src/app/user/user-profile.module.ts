import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from "./profile-container/user-profile.component";
import {PasswordComponent} from "./password/password.component";
import {AccountComponent} from "./account/account.component";
import {IntegrationsComponent} from "./integrations/integrations.component";
import {ProfileFormComponent} from "./profile-form/profile-form.component";
import {USER_PROFILE_ROUTES} from "./user-profile-routes";
import {RouterModule} from "@angular/router";
import {LoggedInServicesModule} from "../logged-in-services.module";
import {SharedModule} from "../shared.module";
import {Ng2ImgMaxModule} from "ng2-img-max";
import {UserDeleteComponent} from "./delete/user-delete.component";
import { SignupComponent } from './account/signup/signup.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoggedInServicesModule,
    Ng2ImgMaxModule,
    RouterModule.forChild(USER_PROFILE_ROUTES),
    NgbModule
  ],
  declarations: [
    UserProfileComponent,
    ProfileFormComponent,
    PasswordComponent,
    AccountComponent,
    IntegrationsComponent,
    UserDeleteComponent,
    SignupComponent
  ]
})
export class UserProfileModule {

}
