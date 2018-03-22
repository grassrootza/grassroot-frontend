import { environment } from "../../environments/environment";
import { MediaFunction } from "../media/media-function.enum";
import { DataSubscriber } from "./datasubscriber/data-subscriber.model";
import { LiveWireAlertDestType } from "./live-wire-alert-dest-type.enum";
import { LiveWireAlertType } from "./live-wire-alert-type.enum";
import { LiveWireAlertPage, LiveWireAlert } from "./live-wire-alert.model";
import { HttpParams } from "@angular/common/http";
import { HttpClient } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable()
export class LiveWireAlertService {

  private createLiveWireAlertUrl = environment.backendAppUrl + "/api/livewire/create";
  private livewireAlertListUrl = environment.backendAppUrl + "/api/livewire/admin/list";
  private loadAlertUrl = environment.backendAppUrl + "/api/livewire/admin/view";
  private updateDescriptionUrl = environment.backendAppUrl + "/api/livewire/admin/modify/description";
  private updateHeadlineUrl = environment.backendAppUrl + "/api/livewire/admin/modify/headline";
  private deleteImageUrl = environment.backendAppUrl + "/api/livewire/admin/modify/images/delete";
  private uploadImageUrl = environment.backendAppUrl + "/api/media/store/body";
  private updateAlertImagesUrl = environment.backendAppUrl + "/api/livewire/admin/modify/images/add";
  private tagLivewireAlertUrl = environment.backendAppUrl + "/api/livewire/admin/tag";
  private blockLivewireAlertUrl = environment.backendAppUrl + "/api/livewire/admin/block";
  private subscriberListUrl = environment.backendAppUrl + "/api/livewire/admin/subscribers";
  private releaseAlertUrl = environment.backendAppUrl + "/api/livewire/admin/release";
  
  constructor(private httpClient:HttpClient) { }
  
    createLiveWireAlert(userUid:string,headline:string,alertType:LiveWireAlertType,groupUid:string,taskUid:string,
                      destination:LiveWireAlertDestType,description:string,addLocation:boolean,contactPerson:string,
                      contactPersonName:string,contactPersonNumber:string,mediaKeys:string[]):Observable<any>{

    let fullUrl = this.createLiveWireAlertUrl + "/" + userUid;
    let params;
    
    console.log("Media file keys..................................",mediaKeys);
    
    let mediaKeyArray: string[] = [];
    

    params = new HttpParams()
      .set("headline",headline)
      .set("description",description)
      .set("type",alertType)
      .set("groupUid",groupUid)
      .set("addLocation",addLocation + "")
      .set("destType",destination)
      .set("taskUid",taskUid)
      .set("mediaFileKeys",mediaKeys.join(","));


      if(contactPerson === "someone"){
      params = new HttpParams()
        .set("headline",headline)
        .set("description",description)
        .set("type",alertType)
        .set("groupUid",groupUid)
        .set("addLocation",addLocation + "")
        .set("destType",destination)
        .set("taskUid",taskUid)
        .set("contactNumber",contactPersonNumber)
        .set("contactName",contactPersonName)
        .set("mediaFileKeys",mediaKeys.join(","));
      }
    return this.httpClient.post(fullUrl,null,{params:params});
  }
  
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
  
  uploadAlertImage(image):Observable<any>{
    let uploadFullUrl = this.uploadImageUrl + "/" + MediaFunction.LIVEWIRE_MEDIA;
    return this.httpClient.post(uploadFullUrl, image,{ responseType: 'json' });
  }
  
  updateAlertImages(alertUid:string,mediaFileKeys:string[]):Observable<LiveWireAlert>{
    console.log("Media file keys to upload......",mediaFileKeys);
    let params = new HttpParams()
      .set('alertUid',alertUid)
      .set('mediaFileKeys',mediaFileKeys.join(","));
    return this.httpClient.post<LiveWireAlert>(this.updateAlertImagesUrl,null,{params:params});
  }
  
  tagAlert(alertUid:string,tags:string):Observable<LiveWireAlert>{
    let params = new HttpParams()
      .set('alertUid',alertUid)
      .set('tags',tags);
    return this.httpClient.post<LiveWireAlert>(this.tagLivewireAlertUrl,null,{params:params});
  }
  
  blockAlert(alertUid:string):Observable<LiveWireAlert>{
    let params = new HttpParams()
      .set('alertUid',alertUid);
    return this.httpClient.post<LiveWireAlert>(this.blockLivewireAlertUrl,null,{params:params});
  }
  
  getSubscribers():Observable<DataSubscriber[]>{
    return this.httpClient.get<DataSubscriber[]>(this.subscriberListUrl)
      .map(resp => resp.map(data => DataSubscriber.createInstance(data)));
  }
  
  releaseAlert(alertUid:string,dataSubscriberUids:string[]):Observable<LiveWireAlert>{
    console.log("Recieved subscriber uids......",dataSubscriberUids);
    let params = new HttpParams()
      .set('alertUid',alertUid)
      .set('publicLists',dataSubscriberUids.join(","))
    
    return this.httpClient.post<LiveWireAlert>(this.releaseAlertUrl,null,{params:params});
  }
}
