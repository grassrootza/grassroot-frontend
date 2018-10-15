import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "environments/environment";
import {BehaviorSubject, Observable} from "rxjs";
import { map } from 'rxjs/operators';
import {CampaignInfo, getCampaignEntity} from "./model/campaign-info";
import {
  CampaignMsgRequest,
  CampaignMsgServerDTO,
  CampaignRequest,
  CampaignUpdateParams
} from "./campaign-create/campaign-request";
import { CampaignMediaRecord, getRecord } from './campaign-dashboard/campaign-media/campaign-media-record.model';

@Injectable()
export class CampaignService {

  campaignListUrl = environment.backendAppUrl + "/api/campaign/manage/list";
  groupCampaignListUrl = environment.backendAppUrl + "/api/campaign/manage/list/group";
  campaignFetchUrl = environment.backendAppUrl + "/api/campaign/manage/fetch";
  fetchMediaUrl = environment.backendAppUrl + "/api/campaign/manage/fetch/media";
  
  campaignCreateUrl = environment.backendAppUrl + "/api/campaign/manage/create";
  campaignActiveCodesUrl = environment.backendAppUrl + "/api/campaign/manage/codes/list/active";  
  checkCodeAvaliabilityUrl = environment.backendAppUrl + "/api/campaign/manage/codes/check";
  checkJoinWordAvailabilityUrl = environment.backendAppUrl + "/api/campaign/manage/words/check";

  campaignMessageSetUrl = environment.backendAppUrl + "/api/campaign/manage/messages/set";

  statsMemberGrowthUrl = environment.backendAppUrl + "/api/campaign/stats/member-growth";
  statsConversionUrl = environment.backendAppUrl + "/api/campaign/stats/conversion";
  statsChannelsUrl = environment.backendAppUrl + "/api/campaign/stats/channels";
  statsProvincesUrl = environment.backendAppUrl + "/api/campaign/stats/provinces";
  statsActivityUrl = environment.backendAppUrl + "/api/campaign/stats/activity";

  changeTypeUrl = environment.backendAppUrl + "/api/campaign/manage/update/type";
  changeBasicSettingsUrl = environment.backendAppUrl + "/api/campaign/manage/update/settings";
  changeSmsSharingUrl = environment.backendAppUrl + "/api/campaign/manage/update/sharing";

  endCampaignUrl = environment.backendAppUrl + "/api/campaign/manage/end";

  fetchCampaignWelcomeMsgUrl = environment.backendAppUrl + "/api/campaign/manage/update/welcome/current";
  setCampaignWelcomeMsgUrl = environment.backendAppUrl + "/api/campaign/manage/update/welcome/set";
  clearCampaignWelcomeMsgUrl = environment.backendAppUrl + "/api/campaign/manage/update/welcome/clear";
  updateCampaignDefaultLangUrl = environment.backendAppUrl + "/api/campaign/manage/update/language";

  exportCampaignResultsUrl = environment.backendAppUrl + '/api/campaign/stats/download';

  private _campaigns: CampaignInfo[] = [];
  private campaignInfoList_: BehaviorSubject<CampaignInfo[]> = new BehaviorSubject([]);
  public campaignInfoList: Observable<CampaignInfo[]> = this.campaignInfoList_.asObservable();

  constructor(private httpClient: HttpClient) {
  }

  loadCampaigns() {
    this.httpClient.get<CampaignInfo[]>(this.campaignListUrl)
      .pipe(map(data => {
          // console.log("Campaign json object from server: ", data);
          return data.map(cp => getCampaignEntity(cp))
        }))
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
      .pipe(map(campaigns => campaigns.map(cp => getCampaignEntity(cp))))
  }

  fetchActiveCampaignCodes(): Observable<string[]> {
    return this.httpClient.get<string[]>(this.campaignActiveCodesUrl);
  }

  createCampaign(request: CampaignRequest): Observable<CampaignInfo> {
    return this.httpClient.post<CampaignInfo>(this.campaignCreateUrl, request);
  }

  setCampaignMessages(campaignUid: string, messageRequests: CampaignMsgRequest[], channel: string): Observable<CampaignInfo> {
    let fullUrl = this.campaignMessageSetUrl + "/" + campaignUid;
    let serverMsgRequests: CampaignMsgServerDTO[] = messageRequests.map(req =>
      new CampaignMsgServerDTO(req.messageId, req.linkedActionType, channel, req.messages, req.nextMsgIds, req.tags));
    // console.log("message request, messages: ", messageRequests.map(mr => mr.messages));
    return this.httpClient.post<CampaignInfo>(fullUrl, serverMsgRequests).pipe(map(result => this.stashChangedCampaign(result)));
  }

  stashChangedCampaign(result): CampaignInfo {
    let campaignEntity = getCampaignEntity(result);
    if (!this._campaigns)
      this._campaigns = [];

    let index = this._campaigns.findIndex(c => c.campaignUid == campaignEntity.campaignUid);
    if (index != -1)
      this._campaigns[index] = campaignEntity;
    else
      this._campaigns.push(campaignEntity);
    return getCampaignEntity(result);
  }

  loadCampaign(campaignUid: string): Observable<CampaignInfo> {
    // should probably chain these better, but will clean up later
    let index = this._campaigns.findIndex(c => c.campaignUid == campaignUid);
    if (this._campaigns && this._campaigns.find(c => c.campaignUid == campaignUid)) {
      return this.campaignInfoList.pipe(map(campaigns => campaigns.find(c => c.campaignUid == campaignUid)));
    } else {
      let fullUrl = this.campaignFetchUrl + "/" + campaignUid;
      return this.httpClient.get<CampaignInfo>(fullUrl).pipe(map(this.stashChangedCampaign));
    }
  }

  fetchCampaignMedia(campaignUid: string): Observable<CampaignMediaRecord[]> {
    const fullUrl = this.fetchMediaUrl + "/" + campaignUid;
    return this.httpClient.get<CampaignMediaRecord[]>(fullUrl).pipe(map(list => list.map(getRecord)));
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

  checkCodeAvailability(campaignCode: string, campaignUid?: string): Observable<boolean> {
    const fullUrl = this.checkCodeAvaliabilityUrl;
    let params = new HttpParams().set("code", campaignCode);
    if (campaignUid) {
      params = params.set("currentCampaignUid", campaignUid);
    }
    return this.httpClient.get<boolean>(fullUrl, {params: params});
  }

  checkJoinWordAvailability(joinWord: string, campaignUid?: string): Observable<boolean> {
    const fullUrl = this.checkJoinWordAvailabilityUrl;
    let params = new HttpParams().set("word", joinWord);
    if (campaignUid) {
      params = params.set("currentCampaignUid", campaignUid);
    }
    return this.httpClient.get<boolean>(fullUrl, {params: params});
  }

  changeCampaignSettings(campaignUid: string, updateParams: CampaignUpdateParams) {
    const fullUrl = this.changeBasicSettingsUrl + "/" + campaignUid;
    let params = new HttpParams();
    if (updateParams.name)
      params = params.set("name", updateParams.name);

    if (updateParams.description)
      params = params.set("description", updateParams.description);

    if (updateParams.mediaFileUid)
      params = params.set("mediaFileUid", updateParams.mediaFileUid);

    if (updateParams.endDateMillis)
      params = params.set("endDateMillis", "" + updateParams.endDateMillis);

    if (updateParams.campaignType)
      params = params.set("campaignType", updateParams.campaignType);

    if (updateParams.newCode)
      params = params.set("newCode", updateParams.newCode);

    if (updateParams.textWord)
      params = params.set("newJoinWord", updateParams.textWord);

    if (updateParams.joinTopics)
      params = params.set("joinTopics", updateParams.joinTopics.join(","));

    if (updateParams.landingUrl)
      params = params.set("landingUrl", updateParams.landingUrl);

    if (updateParams.petitionApi)
      params = params.set("petitionApi", updateParams.petitionApi);

    if (updateParams.removeImage)
      params = params.set("removeImage", updateParams.removeImage.toString());

    if (updateParams.newMasterGroupUid)
      params = params.set("newMasterGroupUid", updateParams.newMasterGroupUid);

    return this.httpClient.post<CampaignInfo>(fullUrl, null, {params: params}).pipe(map(getCampaignEntity));
  }

  changeCampaignSharing(campaignUid: string, sharingEnabled: boolean, smsLimit: number,
                        sharingTemplates?: CampaignMsgRequest[]) {
    const fullUrl = this.changeSmsSharingUrl + "/" + campaignUid;
    let params = new HttpParams().set("sharingEnabled", sharingEnabled.toString()).set("smsLimit", smsLimit.toString());
    let sharingMsgs:CampaignMsgServerDTO[] = sharingTemplates ? sharingTemplates.map(req =>
      new CampaignMsgServerDTO(req.messageId, req.linkedActionType, 'USSD', req.messages, req.nextMsgIds, req.tags)) : null;
    return this.httpClient.post<CampaignInfo>(fullUrl, sharingMsgs, { params: params }).pipe(map(getCampaignEntity));
  }

  endCampaign(campaignUid: string): Observable<CampaignInfo> {
    const fullUrl = this.endCampaignUrl + "/" + campaignUid;
    return this.httpClient.get<CampaignInfo>(fullUrl).pipe(map(getCampaignEntity));
  }

  setCampaignWelcomeMsg(campaignUid: string, message: string): Observable<any> {
    const fullUrl = this.setCampaignWelcomeMsgUrl + "/" + campaignUid;
    const params = new HttpParams().set("message", message);
    return this.httpClient.post(fullUrl, null, { params: params });
  }

  clearCampaignWelcomeMsg(campaignUid: string): Observable<any> {
    const fullUrl = this.clearCampaignWelcomeMsgUrl + "/" + campaignUid;
    return this.httpClient.post(fullUrl, null);
  }

  fetchCurrentWelcomeMsg(campaignUid: string): Observable<string> {
    const fullUrl = this.fetchCampaignWelcomeMsgUrl + "/" + campaignUid;
    return this.httpClient.get(fullUrl, { responseType: 'text'});
  }

  updateCampaignDefaultLanguage(campaignUid: string, languageTwoDigitCode: string) {
    const fullUrl = this.updateCampaignDefaultLangUrl + "/" + campaignUid;
    console.log('setting new default language: ', languageTwoDigitCode);
    const params = new HttpParams().set('defaultLanguage', languageTwoDigitCode);
    return this.httpClient.post<CampaignInfo>(fullUrl, null, { params: params}).pipe(map(response => this.stashChangedCampaign(response)));
  }

  downloadCampaignStats(campaignUid: string) {
    const params = new HttpParams().set('campaignUid', campaignUid);
    return this.httpClient.get(this.exportCampaignResultsUrl, { params: params, responseType: 'blob' });
  }

}
