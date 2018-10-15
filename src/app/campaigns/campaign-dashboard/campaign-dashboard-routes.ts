import {Routes} from "@angular/router";
import {CampaignDashboardComponent} from "./campaign-dashboard.component";
import {LoggedInGuard} from "../../logged-in.guard";
import {CampaignStatsComponent} from "./campaign-stats/campaign-stats.component";
import {CampaignMessagesComponent} from "./campaign-messages/campaign-messages.component";
import {CampaignSettingsComponent} from "./campaign-settings/campaign-settings.component";
import {CampaignBroadcastsComponent} from "./campaign-broadcasts/campaign-broadcasts.component";
import { CampaignMediaComponent } from "./campaign-media/campaign-media.component";

export const CAMPAIGN_DASHBOARD_ROUTES: Routes = [
  {path: '', component: CampaignDashboardComponent, canActivate: [LoggedInGuard],
    children: [
      {path: '', redirectTo:'analyze', pathMatch: 'full'},
      {path: 'analyze', component: CampaignStatsComponent, canActivate: [LoggedInGuard]},
      {path: 'messages/:channel', component: CampaignMessagesComponent, canActivate: [LoggedInGuard]},
      {path: 'media', component: CampaignMediaComponent, canActivate: [LoggedInGuard]},
      {path: 'broadcasts', component: CampaignBroadcastsComponent, canActivate: [LoggedInGuard]},
      {path: 'settings', component: CampaignSettingsComponent, canActivate: [LoggedInGuard]}
  ]}
];
