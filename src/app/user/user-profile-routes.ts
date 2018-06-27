import {Routes} from "@angular/router";
import {LoggedInGuard} from "../logged-in.guard";
import {AccountComponent} from "./account/account.component";
import {ProfileFormComponent} from "./profile-form/profile-form.component";
import {IntegrationsComponent} from "./integrations/integrations.component";
import {PasswordComponent} from "./password/password.component";
import {UserProfileComponent} from "./profile-container/user-profile.component";
import {UserDeleteComponent} from "./delete/user-delete.component";
import { SignupComponent } from "./account/signup/signup.component";

export const USER_PROFILE_ROUTES: Routes = [
  {path: '', component: UserProfileComponent, canActivate: [LoggedInGuard], children: [
    {path: '', redirectTo: 'profile', pathMatch: 'full'},
    {path: 'profile', component: ProfileFormComponent, canActivate: [LoggedInGuard]},
    {path: 'password', component: PasswordComponent, canActivate: [LoggedInGuard]},
    // {path: 'account', component: AccountComponent, canActivate: [LoggedInGuard]},
    
    {path: 'integrations', component: IntegrationsComponent, canActivate: [LoggedInGuard]},
    {path: 'delete', component: UserDeleteComponent, canActivate: [LoggedInGuard]},

    {path: 'signup', component: SignupComponent, canActivate: [LoggedInGuard]},
    {path: 'signup/payment/:accountId', component: SignupComponent, canActivate: [LoggedInGuard]}
  ]}
];
