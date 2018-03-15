import { environment } from "../../environments/environment";
import { LiveWireAlertPage, LiveWireAlert } from "./live-wire-alert.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class LiveWireAlertService {

  private livewireAlertListUrl = environment.backendAppUrl + "/api/livewire/list";
  
  constructor(private httpClient:HttpClient) { }
  
  loadLivewireAlerts():Observable<LiveWireAlertPage>{
    return this.httpClient.get<LiveWireAlertPage>(this.livewireAlertListUrl)
        .map(resp => {let formatedLiveWireAlert = resp.content.map(livewire => LiveWireAlert.createInstance(livewire));
          return new LiveWireAlertPage(resp.number,resp.totalPages,resp.totalElements,resp.size,resp.first,resp.last,formatedLiveWireAlert)
        })
  }
}
