import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserProfileComponent} from "./profile-container/user-profile.component";
import {PasswordComponent} from "./password/password.component";
import {AccountComponent} from "./account/account.component";
import {IntegrationsComponent} from "./integrations/integrations.component";
import {ProfileFormComponent} from "./profile-form/profile-form.component";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    UserProfileComponent,
    ProfileFormComponent,
    PasswordComponent,
    AccountComponent,
    IntegrationsComponent
  ]
})
export class UserProfileModule { }
