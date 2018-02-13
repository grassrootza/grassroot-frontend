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

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoggedInServicesModule,
    RouterModule.forChild(USER_PROFILE_ROUTES)
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
