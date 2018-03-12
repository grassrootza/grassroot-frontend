import { environment } from "../../environments/environment";
import { PublicLivewire, PublicLivewirePage } from "../livewire/public-livewire.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class NewsServiceService {
  
  private publicNewsUrl = environment.backendAppUrl + "/api/news/list"

  constructor(private httpClient:HttpClient) { }

  loadNews():Observable<PublicLivewirePage>{
    return this.httpClient.get<PublicLivewirePage>(this.publicNewsUrl)
      .map(resp => {let plw = resp.content.map(livewire => PublicLivewire.createInstance(livewire));
        return new PublicLivewirePage(
            resp.number,
            resp.totalPages,
            resp.totalElements,
            resp.size,
            resp.first,
            resp.last,
            plw
          )
      }
      )
  }
}
