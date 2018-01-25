import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {CampaignInfo} from "./model/campaign-info";
import {Observable} from "rxjs/Observable";
import {DateTimeUtils} from "../utils/DateTimeUtils";
import {CampaignRequest} from "./campaign-create/campaign-request";

@Injectable()
export class CampaignService {

  campaignListUrl = environment.backendAppUrl + "/api/campaign/manage/list";
  campaignCreateUrl = environment.backendAppUrl + "/api/campaign/manage/create";
  campaignFetchUrl = environment.backendAppUrl + "/api/campaign/manage/fetch";

  campaignTagUrl = environment.backendAppUrl + "/api/campaign/manage/add/tag";
  campaignMessageUrl = environment.backendAppUrl + "/api/campaign/manage/add/message";
  campaignMsgActionUrl = environment.backendAppUrl + "/api/campaign/manage/add/message/action";
  campaignViewUrl = environment.backendAppUrl + "/api/campaign/manage/view";

  // private groupInfoList_: BehaviorSubject<GroupInfo[]> = new BehaviorSubject([]);
  // public groupInfoList: Observable<GroupInfo[]> = this.groupInfoList_.asObservable();

  private _campaigns: CampaignInfo[];
  private campaignInfoList_: BehaviorSubject<CampaignInfo[]> = new BehaviorSubject([]);
  public campaignInfoList: Observable<CampaignInfo[]> = this.campaignInfoList_.asObservable();

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  loadCampaigns(clearCache: Boolean) {
    return this.httpClient.get<CampaignInfo[]>(this.campaignListUrl)
      .map(
        data => {
          console.log("Campaign json object from server: ", data);
          return data.map(
            cp => new CampaignInfo(
              cp.name,
              cp.campaignUid,
              cp.masterGroupName,
              cp.masterGroupUid,
              cp.description,
              DateTimeUtils.getDateFromJavaInstant(cp.campaignStartDate),
              DateTimeUtils.getDateFromJavaInstant(cp.campaignEndDate),
              cp.totalEngaged,
              cp.totalJoined,
              cp.creatingUserName,
              cp.creatingUserUid,
              cp.campaignCode,
              cp.campaignTags
            )
          )
        }
      )
      .subscribe(
        campaigns => {
          this._campaigns = campaigns;
          this.campaignInfoList_.next(this._campaigns)
        },
        error => {
          if (error.status == 401)
            this.userService.logout();
          console.log("Error loading campaigns", error)
        }
      )
  }

  createCampaign(request: CampaignRequest): Observable<CampaignInfo> {
    return this.httpClient.post<CampaignInfo>(this.campaignCreateUrl, request);
  }

  loadCampaign(campaignUid: string): Observable<CampaignInfo> {
    // should probably chain these better, but will clean up later
    if (this._campaigns && this._campaigns.find(c => c.campaignUid == campaignUid)) {
      return this.campaignInfoList.map(campaigns => campaigns.find(c => c.campaignUid == campaignUid));
    } else {
      console.log("no campaign in memory, returning http call");
      let fullUrl = this.campaignFetchUrl + "/" + campaignUid;
      return this.httpClient.get<CampaignInfo>(fullUrl);
    }
  }

}
