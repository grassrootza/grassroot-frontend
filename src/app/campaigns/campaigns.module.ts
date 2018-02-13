import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CampaignInfoComponent} from "./campaign-list/campaign-list-row/campaign-info.component";
import {CampaignsComponent} from "./campaign-list/campaigns.component";
import {CampaignCreateComponent} from "./campaign-create/campaign-create.component";
import {RouterModule} from "@angular/router";
import {CAMPAIGN_ROUTES} from "./campaign-routes";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {LoggedInServicesModule} from "../logged-in-services.module";
import {SharedModule} from "../shared.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoggedInServicesModule,
    NgbModule,
    RouterModule.forChild(CAMPAIGN_ROUTES)
  ],
  declarations: [
    CampaignsComponent,
    CampaignInfoComponent,
    CampaignCreateComponent
  ]
})
export class CampaignsModule {
}
