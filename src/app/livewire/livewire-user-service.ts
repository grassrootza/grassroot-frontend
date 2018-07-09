import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "environments/environment";
import {LiveWireAlertType} from "./live-wire-alert-type.enum";
import {LiveWireAlertDestType} from "./live-wire-alert-dest-type.enum";
import {MediaFunction} from "../media/media-function.enum";
import {LiveWireAlert} from "./live-wire-alert.model";

@Injectable()
export class LivewireUserService {

  private createLiveWireAlertUrl = environment.backendAppUrl + "/api/livewire/create";
  private uploadImageUrl = environment.backendAppUrl + "/api/media/store/body";
  private updateAlertImagesUrl = environment.backendAppUrl + "/api/livewire/admin/modify/images/add";

  constructor(private httpClient:HttpClient) { }

  createLiveWireAlert(userUid:string,headline:string,alertType:LiveWireAlertType,groupUid:string,taskUid:string,
                      destination:LiveWireAlertDestType,description:string,addLocation:boolean,contactPerson:string,
                      contactPersonName:string,contactPersonNumber:string,mediaKeys:string[]):Observable<any>{

    let fullUrl = this.createLiveWireAlertUrl + "/" + userUid;
    let params;

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

}
