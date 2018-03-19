import { environment } from "../../environments/environment";
import { MediaFunction } from "../media/media-function.enum";
import { LiveWireAlertPage, LiveWireAlert } from "./live-wire-alert.model";
import { HttpParams } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class LiveWireAlertService {

  private livewireAlertListUrl = environment.backendAppUrl + "/api/livewire/list";
  private loadAlertUrl = environment.backendAppUrl + "/api/livewire/view";
  private updateDescriptionUrl = environment.backendAppUrl + "/api/livewire/modify/description";
  private updateHeadlineUrl = environment.backendAppUrl + "/api/livewire/modify/headline";
  private deleteImageUrl = environment.backendAppUrl + "/api/livewire/modify/images/delete"
  private uploadImageUrl = environment.backendAppUrl + "/api/media/store/body";
  private updateAlergImagesUrl = environment.backendAppUrl + "/api/livewire/modify/images/add"
  
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
  
  updateAlertDescription(alertUid:string,description:string):Observable<LiveWireAlert>{
    let params = new HttpParams()
      .set('alertUid',alertUid)
      .set('description',description);
    return this.httpClient.post<LiveWireAlert>(this.updateDescriptionUrl,null,{params:params});
  }
  
  updateAlertHeadline(alertUid:string,headline:string):Observable<LiveWireAlert>{
    let params = new HttpParams()
      .set('alertUid',alertUid)
      .set('headline',headline);
    return this.httpClient.post<LiveWireAlert>(this.updateHeadlineUrl,null,{params:params});
  }
  
  deleteAlertImage(imageUid:string,alertUid:string):Observable<LiveWireAlert>{
     let params = new HttpParams()
      .set('alertUid',alertUid)
      .set('imageUid',imageUid);
    return this.httpClient.post<LiveWireAlert>(this.deleteImageUrl,null,{params:params});
  }
}
