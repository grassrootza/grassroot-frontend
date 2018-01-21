import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from "./profile-container/user-profile.component";
import {PasswordComponent} from "./password/password.component";
import {AccountComponent} from "./account/account.component";
import {IntegrationsComponent} from "./integrations/integrations.component";
import {ProfileFormComponent} from "./profile-form/profile-form.component";
import {USER_PROFILE_ROUTES} from "./user-profile-routes";
import {SharedModule} from "../shared.module";
import {Ng4LoadingSpinnerModule} from "ng4-loading-spinner";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(USER_PROFILE_ROUTES),
    Ng4LoadingSpinnerModule
  ],
  declarations: [
    UserProfileComponent,
    ProfileFormComponent,
    PasswordComponent,
    AccountComponent,
    IntegrationsComponent
  ]
})
export class UserProfileModule {

}
