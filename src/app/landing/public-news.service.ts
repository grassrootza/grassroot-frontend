import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from "../../environments/environment";
import {PublicLivewire, PublicLivewirePage} from "./model/public-livewire.model";

@Injectable()
export class PublicNewsService {

  private publicNewsUrl = environment.backendAppUrl + "/api/news/list";

  constructor(private httpClient: HttpClient) {
  }


  public loadLastFiveNews(): Observable<PublicLivewirePage> {
    let params = new HttpParams()
      .set('page', "0")
      .set('size', "5")
      .set("numberToFetch", "5");

    return this.httpClient.get<PublicLivewirePage>(this.publicNewsUrl, {params: params})
      .map(
        result => {
          let transformedContent = result.content.map(PublicLivewire.createInstanceFromData);
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

  loadNews(pageNumber:number):Observable<PublicLivewirePage>{
    let params = new HttpParams()
      .set('size',10 +"")
      .set('sort', 'creationTime,desc')
      .set('page',pageNumber +"");
    return this.httpClient.get<PublicLivewirePage>(this.publicNewsUrl,{params:params})
      .map(resp => {let formatedPublicLiveWire = resp.content.map(PublicLivewire.createInstanceFromData);
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
      )
  }
}
