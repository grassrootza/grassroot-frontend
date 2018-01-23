import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ModuleWithProviders} from "@angular/compiler/src/core";
import {CampaignService} from "./campaign.service";
import {CampaignInfoComponent} from "./campaign-list-row/campaign-info.component";
import {CampaignsComponent} from "./campaign-list/campaigns.component";
import {CampaignCreateComponent} from "./campaign-create/campaign-create.component";
import {RouterModule} from "@angular/router";
import {CAMPAIGN_ROUTES} from "./campaign-routes";
import {SharedModule} from "../shared.module";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    RouterModule.forChild(CAMPAIGN_ROUTES)
  ],
  declarations: [
    CampaignsComponent,
    CampaignInfoComponent,
    CampaignCreateComponent
  ],
  providers: [
    CampaignService
  ]
})
export class CampaignsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CampaignsModule,
      providers: [
        CampaignService
      ]
    }
  }
}
