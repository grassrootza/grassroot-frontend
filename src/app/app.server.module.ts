import {AppModule} from './app.module';
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';

import {AppComponent} from './app.component';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DatePipe} from '@angular/common';
import {LoadingScreenComponent} from "./utils/loading-screen/loading-screen.component";
import {AppServerRoutingModule} from "./app.server.routing.module";

@NgModule({
  declarations: [
    LoadingScreenComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'grassroot-frontend'}),
    AppModule,
    ServerModule,
    AppServerRoutingModule,
    ModuleMapLoaderModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    RouterModule, FormsModule, ReactiveFormsModule, TranslateModule
  ],
  providers: [DatePipe, TranslatePipe],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
