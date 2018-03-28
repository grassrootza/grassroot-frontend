import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {PublicActivity} from "./model/public-activity.model";
import {PublicLivewire, PublicLivewirePage} from "./model/public-livewire.model";

@Injectable()
export class PublicNewsService {

  private activityUrl = environment.backendAppUrl + '/api/news/list';

  constructor(private httpClient: HttpClient) {
  }


  public loadLastFiveNews(): Observable<PublicLivewirePage> {
    let params = new HttpParams()
      .set('page', "0")
      .set('size', "5")
      .set("numberToFetch", "5");

    return this.httpClient.get<PublicLivewirePage>(this.activityUrl, {params: params})
      .map(
        result => {
          let transformedContent = result.content.map(plw => PublicLivewire.createInstanceFromData(plw));
          return new PublicLivewirePage(
            result.number,
            result.totalPages,
            result.totalElements,
            result.size,
            result.first,
            result.last,
            transformedContent);
        }
      );
  }
}
