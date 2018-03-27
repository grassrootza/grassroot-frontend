import {AppModule} from './app.module';
import {BrowserModule, TransferState} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {ServerModule, ServerTransferStateModule} from '@angular/platform-server';
import {ModuleMapLoaderModule} from '@nguniversal/module-map-ngfactory-loader';

import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DatePipe} from '@angular/common';
import {LoadingScreenComponent} from "./utils/loading-screen/loading-screen.component";
import {AppServerRoutingModule} from "./app.server.routing.module";
import {TranslateServerLoader} from "./translate/translate-server-loader.service";

export function translateFactory(transferState: TransferState) {
  return new TranslateServerLoader('/assets/i18n', '.json', transferState);
}

@NgModule({
  declarations: [
    LoadingScreenComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'grassroot-frontend'}),
    ServerTransferStateModule,
    AppModule,
    ServerModule,
    AppServerRoutingModule,
    ModuleMapLoaderModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateFactory,
        deps: [TransferState]
      }
    })
  ],
  exports: [
    RouterModule, FormsModule, ReactiveFormsModule, TranslateModule
  ],
  providers: [DatePipe, TranslatePipe],
  bootstrap: [AppComponent]
})
export class AppServerModule {}
