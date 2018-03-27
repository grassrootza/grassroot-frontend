import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {LoggedInGuard} from './logged-in.guard';
import {GroupService} from "./groups/group.service";
import {UserService} from "./user/user.service";
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from "@angular/common";
import {TaskService} from "./task/task.service";
import {JwtModule} from "@auth0/angular-jwt";
import {GroupMembersImportComponent} from './groups/group-details/group-members/group-members-import/group-members-import.component';
import {FileImportComponent} from './groups/group-details/group-members/group-members-import/file-import/file-import.component';
import {IntegrationsService} from "./user/integrations/integrations.service";
import {JoinService} from "./join/join.service";
import {AlertService} from "./utils/alert.service";
import {PasswordResetService} from "./login/password-reset/password-reset.service";
import {SharedModule} from "./shared.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {NotificationService} from "./user/notification.service";
import {CampaignService} from "./campaigns/campaign.service";
import {BroadcastService} from "./broadcasts/broadcast.service";
import {AccountService} from "./user/account.service";
import {SearchService} from "./search/search.service";
import {LoggedInServicesModule} from "./logged-in-services.module";
import {MediaService} from "./media/media.service";
import {AppBrowserRoutingModule} from "./app.browser.routing.module";
import {PwdResetNewComponent} from "./login/password-reset/pwd-reset-new/pwd-reset-new.component";
import {PwdResetValidateComponent} from "./login/password-reset/pwd-reset-validate/pwd-reset-validate.component";
import {PasswordResetComponent} from "./login/password-reset/password-reset.component";
import {PwdResetInitiateComponent} from "./login/password-reset/pwd-reset-initiate/pwd-reset-initiate.component";
import {IntegrationConnectComponent} from "./user/integrations/integration-connect/integration-connect.component";
import {RecaptchaDirective} from "./utils/recaptcha.directive";

export function getJwtToken(): string {
  return localStorage.getItem('token');
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    GroupMembersImportComponent,
    FileImportComponent,
    RecaptchaDirective,
    IntegrationConnectComponent,
    PwdResetInitiateComponent,
    PwdResetValidateComponent,
    PwdResetNewComponent,
    PasswordResetComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'grassroot-frontend'}),
    HttpClientModule,
    LoggedInServicesModule,
    AppBrowserRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    JwtModule.forRoot({
      config: {
        headerName: 'Authorization',
        authScheme: 'Bearer ',
        tokenGetter: getJwtToken,
        whitelistedDomains: ['localhost:8080', 'staging.grassroot.org.za', 'app.grassroot.org.za']
      }
    }),
    NgbModule.forRoot(),
    SharedModule.forRoot()
  ],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: APP_BASE_HREF, useValue: '/'},
    LoggedInGuard,
    AlertService,
    GroupService,
    CampaignService,
    BroadcastService,
    UserService,
    NotificationService,
    JoinService,
    IntegrationsService,
    TaskService,
    PasswordResetService,
    AccountService,
    SearchService,
    MediaService
  ],
  bootstrap: [AppComponent]
})

export class AppBrowserModule{}
