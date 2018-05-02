import {environment} from "../../../environments/environment";
import {MediaFunction} from "../../media/media-function.enum";
import {DataSubscriber} from "./model/data-subscriber.model";
import {LiveWireAlert, LiveWireAlertPage} from "../../livewire/live-wire-alert.model";
import {FacebookPost} from "./model/facebook-post.model";
import {TwitterPost} from "./model/twitter-post.model";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class LiveWireAdminService {

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
  private postFBUrl = environment.backendAppUrl + "/api/livewire/admin/post/facebook";
  private postTwitterUrl = environment.backendAppUrl + "/api/livewire/admin/post/twitter";
  private allSubscribersUrl = environment.backendAppUrl + "/api/livewire/admin/list/subscribers";
  private createSubscriberUrl = environment.backendAppUrl + "/api/livewire/admin/create/subscriber";
  private loadSubscriberUrl = environment.backendAppUrl + "/api/livewire/admin/subscriber/load";

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

  postOnFB(post:FacebookPost):Observable<any>{
    let params = new HttpParams()
      .set('facebookPageId',"")
      .set('message',post.message)
      .set('linkUrl',post.linkUrl)
      .set('linkName',post.linkName)
      .set('imageKey',post.imageKey)
      .set('imageMediaType',post.imageMediaType)
      .set('imageCaption',post.imageCaption);

    return this.httpClient.post(this.postFBUrl,null,{params:params});
  }

  postOnTwitter(tweet:TwitterPost):Observable<any>{
    let params = new HttpParams()
      .set('message',tweet.message)
      .set('imageMediaFunction',tweet.imageMediaFunction)
      .set('imageKey',tweet.imageKey);
    return this.httpClient.post(this.postTwitterUrl,null,{params:params});
  }

  allSubscribers():Observable<DataSubscriber[]>{
    return this.httpClient.get<DataSubscriber[]>(this.allSubscribersUrl)
    .map(resp => resp.map(data => DataSubscriber.createInstance(data)));
  }

  createSubscriber(displayName:string,primaryEmail:string,addToPushEmails:boolean,emailsForPush:string,active:boolean):Observable<any>{
    let params = new HttpParams()
      .set('displayName',displayName)
      .set('primaryEmail',primaryEmail)
      .set('addToPushEmails',addToPushEmails + "")
      .set('emailsForPush',emailsForPush)
      .set('active',active + "");

    return this.httpClient.post(this.createSubscriberUrl,null,{params:params});
  }

  loadSubscriber(subscriberUid:string):Observable<DataSubscriber>{
    let params = new HttpParams().set('subscriberUid',subscriberUid);
    return this.httpClient.get<DataSubscriber>(this.loadSubscriberUrl,{params:params});
  }
}
