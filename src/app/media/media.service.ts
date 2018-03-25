import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {MediaFunction} from "./media-function.enum";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Injectable()
export class MediaService {

  private uploadMediaUrl = environment.backendAppUrl + "/api/media/store/body";
  private fetchImageUrl = environment.mediaFetchUrl;

  public IMAGE_EXTENSIONS = "png, jpg, jpeg, gif";
  public DEFAULT_MAX_SIZE = 2; // in mb

  constructor(private httpClient: HttpClient) { }

  uploadMedia(image: any, mediaFunction: MediaFunction, mimeType: string = ""): Observable<string>{
    const uploadFullUrl = this.uploadMediaUrl + "/" + mediaFunction;
    const formData: FormData = new FormData();
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

  public isValidImage(image, checkFileSize: boolean, fileMax?: number): string[] {
    let imageErrors: string[] = [];
    if (!this.isValidFileType(image))
      imageErrors.push("Error (image file type): " + image.name);
    if (checkFileSize && !this.isValidFileSize(image))
      imageErrors.push("Error (file size): " + image.name + ": exceed file size limit of " + (fileMax ? fileMax : this.DEFAULT_MAX_SIZE) + "MB");
    return imageErrors;
  }

  public isValidFileType(image) {
    let extensions = (this.IMAGE_EXTENSIONS.split(',')).map(x => x.toLocaleUpperCase().trim());
    let ext = image.name.toUpperCase().split('.').pop() || image.name;
    return extensions.includes(ext);
  }

  // max should be in mb
  public isValidFileSize(image, max?: number) {
    let fileSizeinMB = image.size / (1024 * 1000);
    let size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
    let threshold = max ? max : this.DEFAULT_MAX_SIZE;
    return size < threshold;
  }


}
