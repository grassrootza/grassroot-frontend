import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {environment} from "../../environments/environment.prod";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {CampaignInfo} from "./model/campaign-info";
import {Observable} from "rxjs/Observable";
import {DateTimeUtils} from "../DateTimeUtils";

@Injectable()
export class CampaignService {

  campaignListUrl = environment.backendAppUrl + "/api/campaign/manage/list";
  campaignCreateUrl = environment.backendAppUrl + "/api/campaign/manage/create";
  campaignTagUrl = environment.backendAppUrl + "/api/campaign/manage/add/tag";
  campaignMessageUrl = environment.backendAppUrl + "/api/campaign/manage/add/message";
  campaignMsgActionUrl = environment.backendAppUrl + "/api/campaign/manage/add/message/action";
  campaignViewUrl = environment.backendAppUrl + "/api/campaign/manage/view";

  // private groupInfoList_: BehaviorSubject<GroupInfo[]> = new BehaviorSubject([]);
  // public groupInfoList: Observable<GroupInfo[]> = this.groupInfoList_.asObservable();

  private campaignInfoList_: BehaviorSubject<CampaignInfo[]> = new BehaviorSubject([]);
  public campaignInfoList: Observable<CampaignInfo[]> = this.campaignInfoList_.asObservable();

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  loadCampaigns(clearCache: Boolean) {
    return this.httpClient.get<CampaignInfo[]>(this.campaignListUrl)
      .map(
        data => {
          console.log("Campaign json object from server: ", data)
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
          this.campaignInfoList_.next(campaigns)
        },
        error => {
          if (error.status == 401)
            this.userService.logout();
          console.log("Error loading campaigns", error)
        }
      )
  }

}
