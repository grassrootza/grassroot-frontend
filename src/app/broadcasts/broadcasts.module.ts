import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {QuillEditorModule} from "ngx-quill-editor/index";
import {ModuleWithProviders} from "@angular/compiler/src/core";
import {BroadcastService} from "./broadcast.service";
import {BROADCAST_ROUTES} from "./broadcast-routes";
import {QuillEditorComponent} from "ngx-quill-editor/quillEditor.component";
import {BroadcastTypeComponent} from "./broadcast-create/broadcast-type/broadcast-type.component";
import {BroadcastMembersComponent} from "./broadcast-create/broadcast-members/broadcast-members.component";
import {BroadcastScheduleComponent} from "./broadcast-create/broadcast-schedule/broadcast-schedule.component";
import {BroadcastConfirmComponent} from "./broadcast-create/broadcast-confirm/broadcast-confirm.component";
import {BroadcastWorkflowGuard} from "./broadcast-create/create-workflow-guard.guard";
import {BroadcastCreateComponent} from "./broadcast-create/broadcast-create.component";
import {BroadcastContentComponent} from "./broadcast-create/broadcast-content/broadcast-content.component";
import {SharedModule} from "../shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    QuillEditorModule,
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
  exports: [
    QuillEditorComponent
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
