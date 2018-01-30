import {Routes} from "@angular/router";
import {CampaignDashboardComponent} from "./campaign-dashboard.component";
import {LoggedInGuard} from "../../logged-in.guard";
import {CampaignStatsComponent} from "./campaign-stats/campaign-stats.component";
import {CampaignMessagesComponent} from "./campaign-messages/campaign-messages.component";
import {CampaignSettingsComponent} from "./campaign-settings/campaign-settings.component";
import {CampaignBroadcastsComponent} from "./campaign-broadcasts/campaign-broadcasts.component";

export const CAMPAIGN_DASHBOARD_ROUTES: Routes = [
  {path: '', component: CampaignDashboardComponent, canActivate: [LoggedInGuard],
    children: [
      {path: '', redirectTo:'messages', pathMatch: 'full'},
      {path: 'analyze', component: CampaignStatsComponent, canActivate: [LoggedInGuard]},
      {path: 'messages', component: CampaignMessagesComponent, canActivate: [LoggedInGuard]},
      {path: 'broadcasts', component: CampaignBroadcastsComponent, canActivate: [LoggedInGuard]},
      {path: 'settings', component: CampaignSettingsComponent, canActivate: [LoggedInGuard]}
  ]}
];
