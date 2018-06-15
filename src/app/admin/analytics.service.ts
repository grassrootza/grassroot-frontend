import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';

@Injectable()
export class AnalyticsService {

  private fetchAnalyticsKeysUrl = environment.backendAppUrl + "/api/admin/analytics/metrics";
  private fecthCumulativeCountsForMetric = environment.backendAppUrl + "/api/admin/analytics/cumulative";
  private fetchIncrementalCountsForMetric = environment.backendAppUrl + "/api/admin/analytics/incremental";

  constructor(private httpClient: HttpClient) { }

  loadAnalyticsKeys() {
    return this.httpClient.get(this.fetchAnalyticsKeysUrl);
  }

  loadCumulativeCountsForMetric(metric: string) {
    let params = new HttpParams().set("metric", metric);
    return this.httpClient.get(this.fecthCumulativeCountsForMetric, {params: params});
  }

  loadIncrementalCountsForMetric(metric: string) {
    let params = new HttpParams().set("metric", metric);
    return this.httpClient.get(this.fetchIncrementalCountsForMetric, {params: params});
  }

}
