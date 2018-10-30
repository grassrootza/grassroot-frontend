import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {environment} from 'environments/environment';
import {AppBrowserModule} from "app/app.browser.module";

if (environment.production) {
  enableProdMode();
}

document.addEventListener("DOMContentLoaded", () => {
  platformBrowserDynamic()
    .bootstrapModule(AppBrowserModule)
    .then(() => {
      if('serviceWorker' in navigator && environment.production){
        navigator.serviceWorker.register('sw-master.js');
      }
    })
    .catch(err => console.log(err));
});
