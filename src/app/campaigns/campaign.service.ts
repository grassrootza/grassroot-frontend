import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {CampaignInfo, getCampaignEntity} from "./model/campaign-info";
import {Observable} from "rxjs/Observable";
import {CampaignMsgRequest, CampaignMsgServerDTO, CampaignRequest} from "./campaign-create/campaign-request";

@Injectable()
export class CampaignService {

  campaignListUrl = environment.backendAppUrl + "/api/campaign/manage/list";
  groupCampaignListUrl = environment.backendAppUrl + "/api/campaign/manage/list/group";
  campaignCreateUrl = environment.backendAppUrl + "/api/campaign/manage/create";
  campaignFetchUrl = environment.backendAppUrl + "/api/campaign/manage/fetch";
  campaignActiveCodesUrl = environment.backendAppUrl + "/api/campaign/manage/codes/list/active";

  campaignMessageSetUrl = environment.backendAppUrl + "/api/campaign/manage/messages/set";

  statsMemberGrowthUrl = environment.backendAppUrl + "/api/campaign/stats/member-growth";
  statsConversionUrl = environment.backendAppUrl + "/api/campaign/stats/conversion";
  statsChannelsUrl = environment.backendAppUrl + "/api/campaign/stats/channels";
  statsProvincesUrl = environment.backendAppUrl + "/api/campaign/stats/provinces";
  statsActivityUrl = environment.backendAppUrl + "/api/campaign/stats/activity";

  changeTypeUrl = environment.backendAppUrl + "/api/campaign/manage/update/type";

  private _campaigns: CampaignInfo[];
  private campaignInfoList_: BehaviorSubject<CampaignInfo[]> = new BehaviorSubject([]);
  public campaignInfoList: Observable<CampaignInfo[]> = this.campaignInfoList_.asObservable();

  constructor(private httpClient: HttpClient) { }

  loadCampaigns() {

    this.httpClient.get<CampaignInfo[]>(this.campaignListUrl)
      .map(data => {
          console.log("Campaign json object from server: ", data);
          return data.map(cp => getCampaignEntity(cp))
        })
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

  loadGroupCampaigns(groupUid: string): Observable<CampaignInfo[]> {
    const params = new HttpParams()
      .set("groupUid", groupUid);

    return this.httpClient.get<CampaignInfo[]>(this.groupCampaignListUrl, {params: params})
      .map(campaigns => campaigns.map(cp => getCampaignEntity(cp)))
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
    let serverMsgRequests: CampaignMsgServerDTO[] = messageRequests.map(req =>
      new CampaignMsgServerDTO(req.messageId, req.linkedActionType, req.messages, req.nextMsgIds, req.tags));
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

  fetchMemberGrowthStats(campaignUid: string, year: number, month: number): Observable<any> {
    const fullUrl = this.statsMemberGrowthUrl;
    let params = new HttpParams().set("campaignUid", campaignUid);

    if (year)
      params = params.set("year", year.toString());

    if (month)
      params = params.set("month", month.toString());

    return this.httpClient.get<any>(fullUrl, {params: params});
  }

  fetchConversionStats(campaignUid: string) {
    const fullUrl = this.statsConversionUrl;
    let params = new HttpParams().set("campaignUid", campaignUid);
    return this.httpClient.get<any>(fullUrl, {params: params});
  }

  fetchChannelStats(campaignUid: string) {
    const fullUrl = this.statsChannelsUrl;
    let params = new HttpParams().set("campaignUid", campaignUid);
    return this.httpClient.get<any>(fullUrl, {params: params});
  }

  fetchProvinceStats(campaignUid: string) {
    const fullUrl = this.statsProvincesUrl;
    let params = new HttpParams().set("campaignUid", campaignUid);
    return this.httpClient.get<any>(fullUrl, {params: params});
  }

  fetchActivityStats(campaignUid: string, datasetDivision: string, timePeriod: string) {
    const fullUrl = this.statsActivityUrl;
    let params = new HttpParams().set("campaignUid", campaignUid)
      .set("datasetDivision", datasetDivision).set("timePeriod", timePeriod);
    return this.httpClient.get<any>(fullUrl, {params: params});
  }

  /*
  Modification section
   */
  updateCampaignType(campaignUid: string, newType: string) {
    const fullUrl = this.changeTypeUrl + "/" + campaignUid;
    let params = new HttpParams().set("campaignType", newType);
    return this.httpClient.post<any>(fullUrl, null, {params: params});
  }

}
