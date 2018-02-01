import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../shared.module";
import {CAMPAIGN_DASHBOARD_ROUTES} from "./campaign-dashboard/campaign-dashboard-routes";
import {CampaignStatsComponent} from './campaign-dashboard/campaign-stats/campaign-stats.component';
import {CampaignDashboardComponent} from './campaign-dashboard/campaign-dashboard.component';
import {CampaignMessagesComponent} from './campaign-dashboard/campaign-messages/campaign-messages.component';
import {CampaignBroadcastsComponent} from './campaign-dashboard/campaign-broadcasts/campaign-broadcasts.component';
import {CampaignSettingsComponent} from './campaign-dashboard/campaign-settings/campaign-settings.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MessageTabsetComponent} from "./campaign-dashboard/campaign-messages/message-tabset/message-tabset.component";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    RouterModule.forChild(CAMPAIGN_DASHBOARD_ROUTES)
  ],
  declarations: [
    CampaignDashboardComponent,
    CampaignStatsComponent,
    CampaignMessagesComponent,
    CampaignBroadcastsComponent,
    CampaignSettingsComponent,
    MessageTabsetComponent
  ]
})
export class CampaignDashboardModule {

}
