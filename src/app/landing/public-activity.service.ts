import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import "rxjs/add/operator/map";
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from "environments/environment";
import {PublicActivity} from "./model/public-activity.model";
import { map } from 'rxjs/operators';

@Injectable()
export class PublicActivityService {

  private activityUrl = environment.backendAppUrl + '/api/activity/list';

  constructor(private httpClient: HttpClient) {
  }


  public loadLastFiveActivities(): Observable<PublicActivity[]> {
    let params = new HttpParams()
      .set("numberToFetch", "5");

    return this.httpClient.get<PublicActivity[]>(this.activityUrl, {params: params})
      .pipe(map(result => result.map(PublicActivity.createInstanceFromData)));
  }
}
