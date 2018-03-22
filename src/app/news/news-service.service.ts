import { environment } from "../../environments/environment";
import { PublicLivewire, PublicLivewirePage } from "../livewire/public-livewire.model";
import { HttpParams } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

declare var $: any;

@Injectable()
export class NewsServiceService {
  
  private publicNewsUrl = environment.backendAppUrl + "/api/news/list"

  constructor(private httpClient:HttpClient) { }

  loadNews(pageNumber:number):Observable<PublicLivewirePage>{
    let params = new HttpParams()
      .set('size',10 +"")
      .set('sort', 'creationTime,desc')
      .set('page',pageNumber +"")
    return this.httpClient.get<PublicLivewirePage>(this.publicNewsUrl,{params:params})
      .map(resp => {let formatedPublicLiveWire = resp.content.map(livewire => PublicLivewire.createInstance(livewire));
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
