import {Routes} from "@angular/router";
import {LoggedInGuard} from "../logged-in.guard";
import {CampaignCreateComponent} from "./campaign-create/campaign-create.component";
import {CampaignsComponent} from "./campaign-list/campaigns.component";

export const CAMPAIGN_ROUTES: Routes = [
  {path: '', component: CampaignsComponent, canActivate: [LoggedInGuard]},
  {path: 'create', component: CampaignCreateComponent, canActivate: [LoggedInGuard]},
];
