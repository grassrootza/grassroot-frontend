import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../shared.module";
import {CampaignDashboardRoutes} from "./campaign-dashboard/campaign-dashboard-routes";
import {BroadcastsModule} from "../broadcasts/broadcasts.module";
import {CampaignStatsComponent} from './campaign-dashboard/campaign-stats/campaign-stats.component';
import {CampaignDashboardComponent} from './campaign-dashboard/campaign-dashboard.component';
import {CampaignMessagesComponent} from './campaign-dashboard/campaign-messages/campaign-messages.component';
import {CampaignBroadcastsComponent} from './campaign-dashboard/campaign-broadcasts/campaign-broadcasts.component';
import {CampaignSettingsComponent} from './campaign-dashboard/campaign-settings/campaign-settings.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CampaignDashboardRoutes,
    NgbModule,
    BroadcastsModule
  ],
  declarations: [
    CampaignDashboardComponent,
    CampaignStatsComponent,
    CampaignMessagesComponent,
    CampaignBroadcastsComponent,
    CampaignSettingsComponent
  ]
})
export class CampaignDashboardModule {

}
