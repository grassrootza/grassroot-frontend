import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ANIMATION_TYPES, LoadingModule} from 'ngx-loading';
import {APP_BASE_HREF, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {UserService} from './user/user.service';
import {AlertService} from './utils/alert-service/alert.service';

import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {LoginComponent} from './login/login.component';
import {JoinComponent} from './join/join.component';
import {RegistrationComponent} from './registration/registration.component';
import {JoinService} from './join/join.service';
import {LocalStorageService} from "./utils/local-storage.service";
import {IntegrationsService} from "./user/integrations/integrations.service";
import {PasswordResetService} from "./login/password-reset/password-reset.service";
import {NotificationService} from "./user/notification.service";
import {PwdResetNewComponent} from "./login/password-reset/pwd-reset-new/pwd-reset-new.component";
import {PwdResetValidateComponent} from "./login/password-reset/pwd-reset-validate/pwd-reset-validate.component";
import {PasswordResetComponent} from "./login/password-reset/password-reset.component";
import {PwdResetInitiateComponent} from "./login/password-reset/pwd-reset-initiate/pwd-reset-initiate.component";
import {IntegrationConnectComponent} from "./user/integrations/integration-connect/integration-connect.component";
import {RecaptchaDirective} from "./utils/recaptcha.directive";
import {LandingComponent} from "./landing/landing.component";
import {PublicActivityService} from "./landing/public-activity.service";
import {CarouselComponent} from "./landing/carousel/carousel.component";
import {NewsComponent} from "./news/news.component";
import {PublicNewsService} from "./landing/public-news.service";
import {MediaService} from "./media/media.service";
import {HomeScreenRoutingComponent} from "./landing/home-screen-routing.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    JoinComponent,
    RecaptchaDirective,
    IntegrationConnectComponent,
    PwdResetInitiateComponent,
    PwdResetValidateComponent,
    PwdResetNewComponent,
    PasswordResetComponent,
    HomeScreenRoutingComponent,
    LandingComponent,
    CarouselComponent,
    NewsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LoadingModule.forRoot({
      animationType: ANIMATION_TYPES.circleSwish, backdropBackgroundColour: 'rgba(0,0,0,0.2)',
      backdropBorderRadius: '4px', primaryColour: '#26A041', secondaryColour: '#2CBC4C'}
    ),
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot()
  ],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: APP_BASE_HREF, useValue: '/'},
    AlertService,
    UserService,
    JoinService,
    IntegrationsService,
    PasswordResetService,
    LocalStorageService,
    NotificationService,
    PublicActivityService,
    PublicNewsService,
    MediaService
  ]
})
export class AppModule { }
