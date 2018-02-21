import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModuleWithProviders} from "@angular/compiler/src/core";
import {TranslateModule, TranslatePipe} from "@ngx-translate/core";


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    RouterModule, FormsModule, ReactiveFormsModule, TranslateModule
  ],
  declarations: []
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        DatePipe,
        TranslatePipe
      ]
    }
  }
}
