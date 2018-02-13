import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModuleWithProviders} from "@angular/compiler/src/core";
import {BroadcastService} from "./broadcast.service";
import {BROADCAST_ROUTES} from "./broadcast-routes";
import {BroadcastTypeComponent} from "./broadcast-create/broadcast-type/broadcast-type.component";
import {BroadcastMembersComponent} from "./broadcast-create/broadcast-members/broadcast-members.component";
import {BroadcastScheduleComponent} from "./broadcast-create/broadcast-schedule/broadcast-schedule.component";
import {BroadcastConfirmComponent} from "./broadcast-create/broadcast-confirm/broadcast-confirm.component";
import {BroadcastWorkflowGuard} from "./broadcast-create/create-workflow-guard.guard";
import {BroadcastCreateComponent} from "./broadcast-create/broadcast-create.component";
import {BroadcastContentComponent} from "./broadcast-create/broadcast-content/broadcast-content.component";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterModule} from "@angular/router";
import {QuillModule} from "ngx-quill";
import {Ng2ImgMaxModule} from "ng2-img-max";
import {LoggedInServicesModule} from "../logged-in-services.module";
import {SharedModule} from "../shared.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoggedInServicesModule,
    NgbModule,
    QuillModule,
    Ng2ImgMaxModule,
    RouterModule.forChild(BROADCAST_ROUTES)
  ],
  declarations: [
    BroadcastCreateComponent,
    BroadcastTypeComponent,
    BroadcastContentComponent,
    BroadcastMembersComponent,
    BroadcastScheduleComponent,
    BroadcastConfirmComponent,
  ],
  entryComponents: [
    BroadcastConfirmComponent
  ],
  providers: [
    BroadcastService,
    BroadcastWorkflowGuard
  ]
})
export class BroadcastsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: BroadcastsModule,
      providers: [
        BroadcastService
      ]
    }
  }
}
