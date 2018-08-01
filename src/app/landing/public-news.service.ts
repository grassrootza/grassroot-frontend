import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from "environments/environment";
import {PublicLivewire, PublicLivewirePage} from "../livewire/public-livewire.model";

@Injectable()
export class PublicNewsService {

  private publicNewsHeadlineUrl = environment.backendAppUrl + "/api/news/list/headlines";
  private publicNewsAlertsUrl = environment.backendAppUrl + "/api/news/list/full";
  private alertPageNumberUrl = environment.backendAppUrl + "/api/news/page/number";

  constructor(private httpClient: HttpClient) {
  }

  public loadLastFiveNews(): Observable<PublicLivewirePage> {
    let params = new HttpParams()
      .set('page', "0")
      .set('size', "5")
      .set('sort', 'creationTime,desc')
      .set("numberToFetch", "5");

    return this.httpClient.get<PublicLivewirePage>(this.publicNewsHeadlineUrl, {params: params})
      .pipe(map(
        result => {
          let transformedContent = result.content.map(PublicLivewire.createInstance);
          return new PublicLivewirePage(
            result.number,
            result.totalPages,
            result.totalElements,
            result.size,
            result.first,
            result.last,
            transformedContent);
        }
      ));
  }

  loadNews(pageNumber:number):Observable<PublicLivewirePage>{
    let params = new HttpParams()
      .set('size', 10 + "")
      .set('sort', 'creationTime,desc')
      .set('page', pageNumber +"");
    return this.httpClient.get<PublicLivewirePage>(this.publicNewsAlertsUrl,{params:params})
      .pipe(map(resp => {let formatedPublicLiveWire = resp.content.map(PublicLivewire.createInstance);
          return new PublicLivewirePage(
            resp.number,
            resp.totalPages,
            resp.totalElements,
            resp.size,
            resp.first,
            resp.last,
            formatedPublicLiveWire
          )
        }
      ));
  }

  findAlertPageNumber(alertUid:string):Observable<any>{
    let params = new HttpParams().set('alertUid',alertUid);
    return this.httpClient.get(this.alertPageNumberUrl,{params:params});
  }

}
