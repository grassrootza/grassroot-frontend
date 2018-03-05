import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MediaFunction} from "./media-function.enum";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Injectable()
export class MediaService {

  private uploadMediaUrl = environment.backendAppUrl + "/api/media/store/body";
  private fetchImageUrl = environment.backendAppUrl + "/image";


  constructor(private httpClient: HttpClient) { }

  uploadMedia(image: any, mediaFunction: MediaFunction, mimeType: string = ""): Observable<string>{
    let uploadFullUrl = this.uploadMediaUrl + "/" + mediaFunction;
    let formData: FormData = new FormData();
    formData.append("file", image, image.name);
    console.log("formdata: ", formData);

    let params = new HttpParams();
    if (mimeType && mimeType.length > 0) {
      params = params.set("mimeType", mimeType);
    }

    return this.httpClient.post<any>(uploadFullUrl, formData, { params: params, responseType: 'json' }).map(response => {
      console.log("okay response from server: ", response);
      return response['data'];
    });
  }

  getImageUrl(mediaFunction: MediaFunction, imageKey: string): string {
    return this.fetchImageUrl + "/" + mediaFunction + "/" + imageKey;
  }

}
