import {Observable} from "rxjs";
import {TranslateLoader} from '@ngx-translate/core';
import {makeStateKey, StateKey, TransferState} from '@angular/platform-browser';

declare var require: any;

const fs = require('fs');

export class TranslateServerLoader implements TranslateLoader {

  constructor(private prefix: string = 'i18n',
              private suffix: string = '.json',
              private transferState: TransferState) {
    console.log("constructed translate server module ...");
  }

  public getTranslation(lang: string): Observable<any> {
    console.log("getting a translation ... ");

    return Observable.create(observer => {
      const jsonData = JSON.parse(fs.readFileSync(`dist/assets/i18n/${lang}${this.suffix}`, 'utf8'));

      // Here we save the translations in the transfer-state
      const key: StateKey<number> = makeStateKey<number>('transfer-translate-' + lang);
      this.transferState.set(key, jsonData);

      observer.next(jsonData);
      observer.complete();
    });
  }
}
