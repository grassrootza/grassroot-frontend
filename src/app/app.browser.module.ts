import {BrowserModule, BrowserTransferStateModule, TransferState} from '@angular/platform-browser';
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
import {JoinService} from "./landing/join/join.service";
import {AlertService} from "./utils/alert-service/alert.service";
import {PasswordResetService} from "./login/password-reset/password-reset.service";
import {SharedModule} from "./shared.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HttpClient} from "@angular/common/http";
import {NotificationService} from "./user/notification.service";
import {CampaignService} from "./campaigns/campaign.service";
import {AccountService} from "./user/account.service";
import {SearchService} from "./search/search.service";
import {LoggedInServicesModule} from "./logged-in-services.module";
import {MediaService} from "./media/media.service";
import {AppBrowserRoutingModule} from "./app.browser.routing.module";
import {AppModule} from "./app.module";
import {TranslateBrowserLoader} from "./translate/translate-browser-loader.service";
import {CookiesService} from "./utils/cookie-service/cookies.service";
import {BrowserCookiesService} from "./utils/cookie-service/browser-cookies.service";
import {CookieModule} from "ngx-cookie";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AdminService} from './admin/admin.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UpdateService } from './utils/update.service';

export function getJwtToken(): string {
  return localStorage.getItem('token');
}

export function exportTranslateStaticLoader(http: HttpClient, transferState: TransferState) {
  return new TranslateBrowserLoader('/assets/i18n/', '.json', transferState, http);
}

@NgModule({
  declarations: [
    GroupMembersImportComponent,
    FileImportComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'grassroot-frontend'}),
    BrowserTransferStateModule,
    AppModule,
    BrowserAnimationsModule,
    LoggedInServicesModule,
    AppBrowserRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: exportTranslateStaticLoader,
        deps: [HttpClient, TransferState]
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
    SharedModule.forRoot(),
    CookieModule.forRoot(),
    ServiceWorkerModule.register('sw-master.js', { enabled: environment.production })
  ],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: APP_BASE_HREF, useValue: '/'},
    LoggedInGuard,
    AlertService,
    GroupService,
    CampaignService,
    UserService,
    NotificationService,
    JoinService,
    IntegrationsService,
    TaskService,
    PasswordResetService,
    AccountService,
    SearchService,
    MediaService,
    AdminService,
    UpdateService,
    {provide: CookiesService, useClass: BrowserCookiesService}
  ],
  bootstrap: [AppComponent]
})

export class AppBrowserModule{}
