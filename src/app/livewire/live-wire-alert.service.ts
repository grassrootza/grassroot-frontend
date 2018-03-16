import { environment } from "../../environments/environment";
import { LiveWireAlertPage, LiveWireAlert } from "./live-wire-alert.model";
import { HttpParams } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class LiveWireAlertService {

  private livewireAlertListUrl = environment.backendAppUrl + "/api/livewire/list";
  private loadAlertUrl = environment.backendAppUrl + "/api/livewire/view";
  
  
  constructor(private httpClient:HttpClient) { }
  
  loadLivewireAlerts(pageNumber:number,sort:string):Observable<LiveWireAlertPage>{
    let params = new HttpParams()
        .set('sort', 'creationTime,'+sort)
        .set('page',pageNumber + "")
        .set('size',10 + "");
    return this.httpClient.get<LiveWireAlertPage>(this.livewireAlertListUrl,{params:params})
        .map(resp => {let formatedLiveWireAlert = resp.content.map(livewire => LiveWireAlert.createInstance(livewire));
          return new LiveWireAlertPage(resp.number,resp.totalPages,resp.totalElements,resp.size,resp.first,resp.last,formatedLiveWireAlert)
        })
  }
  
  loadAlert(serverUid:string):Observable<LiveWireAlert>{
    let params = new HttpParams().set('serverUid',serverUid);
    return this.httpClient.get<LiveWireAlert>(this.loadAlertUrl,{params:params});
  }
}
