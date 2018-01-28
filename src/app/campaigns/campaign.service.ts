import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {CampaignInfo, getCampaignEntity} from "./model/campaign-info";
import {Observable} from "rxjs/Observable";
import {CampaignMsgRequest, CampaignMsgServerReq, CampaignRequest} from "./campaign-create/campaign-request";

@Injectable()
export class CampaignService {

  campaignListUrl = environment.backendAppUrl + "/api/campaign/manage/list";
  campaignCreateUrl = environment.backendAppUrl + "/api/campaign/manage/create";
  campaignFetchUrl = environment.backendAppUrl + "/api/campaign/manage/fetch";
  campaignActiveCodesUrl = environment.backendAppUrl + "/api/campaign/manage/codes/list/active";

  campaignMessageSetUrl = environment.backendAppUrl + "/api/campaign/manage/messages/set";

  campaignTagUrl = environment.backendAppUrl + "/api/campaign/manage/add/tag";
  campaignMsgActionUrl = environment.backendAppUrl + "/api/campaign/manage/add/message/action";
  campaignViewUrl = environment.backendAppUrl + "/api/campaign/manage/view";


  private _campaigns: CampaignInfo[];
  private campaignInfoList_: BehaviorSubject<CampaignInfo[]> = new BehaviorSubject([]);
  public campaignInfoList: Observable<CampaignInfo[]> = this.campaignInfoList_.asObservable();

  constructor(private httpClient: HttpClient, private userService: UserService) { }

  loadCampaigns(clearCache: Boolean) {
    return this.httpClient.get<CampaignInfo[]>(this.campaignListUrl)
      .map(
        data => {
          console.log("Campaign json object from server: ", data);
          return data.map(cp => getCampaignEntity(cp))
        }
      )
      .subscribe(
        campaigns => {
          this._campaigns = campaigns;
          this.campaignInfoList_.next(this._campaigns)
        },
        error => {
          console.log("Error loading campaigns", error)
        }
      )
  }

  fetchActiveCampaignCodes(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.campaignActiveCodesUrl);
  }

  createCampaign(request: CampaignRequest): Observable<CampaignInfo> {
    return this.httpClient.post<CampaignInfo>(this.campaignCreateUrl, request);
  }

  setCampaignMessages(campaignUid: string, messageRequests: CampaignMsgRequest[]): Observable<CampaignInfo> {
    console.log("sending message requests: ", messageRequests);
    let fullUrl = this.campaignMessageSetUrl + "/" + campaignUid;
    let serverMsgRequests: CampaignMsgServerReq[] = messageRequests.map(req =>
      new CampaignMsgServerReq(req.messageId, req.linkedActionType, req.messages, req.nextMsgIds, req.tags));
    console.log("server msg requests: ", serverMsgRequests);
    // console.log("message request, messages: ", messageRequests.map(mr => mr.messages));
    return this.httpClient.post<CampaignInfo>(fullUrl, serverMsgRequests);
  }

  loadCampaign(campaignUid: string): Observable<CampaignInfo> {
    // should probably chain these better, but will clean up later
    if (this._campaigns && this._campaigns.find(c => c.campaignUid == campaignUid)) {
      return this.campaignInfoList.map(campaigns => campaigns.find(c => c.campaignUid == campaignUid));
    } else {
      let fullUrl = this.campaignFetchUrl + "/" + campaignUid;
      return this.httpClient.get<CampaignInfo>(fullUrl).map(cp => getCampaignEntity(cp));
    }
  }

}
