import { MediaFunction } from "../../media/media-function.enum";
import { MediaService } from "../../media/media.service";
import { DataSubscriber } from "../datasubscriber/data-subscriber.model";
import { LiveWireAlert } from "../live-wire-alert.model";
import { LiveWireAlertService } from "../live-wire-alert.service";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-view-alert',
  templateUrl: './view-alert.component.html',
  styleUrls: ['./view-alert.component.css']
})
export class ViewAlertComponent implements OnInit {

  public alertUid:string = "";
  public liveWireAlert:LiveWireAlert;
  public imageUrl:string = "";
  public headline:string = "";
  public desc:string = "";
  public imageKeys:string[] = [];
  public subscribers:DataSubscriber[] = [];
  
  constructor(private route:ActivatedRoute,
              private liveWireAlertService:LiveWireAlertService,
              private mediaService:MediaService,
              private router:Router) { 
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.alertUid = params['id'];
      this.loadAlert(this.alertUid);
    },error=>{
      console.log("Error getting params....",error);
    });
  }
  
  loadAlert(alertUid:string){
    this.liveWireAlertService.loadAlert(alertUid).subscribe(resp => {
      this.liveWireAlert = resp;
      console.log("Response ..........",this.liveWireAlert);
    },error =>{
      console.log("Error loading alert....................",error);
    })
  }
  
  loadImageUrl(imageKey:string):string{
    return this.mediaService.getImageUrl(MediaFunction.LIVEWIRE_MEDIA,imageKey);
  }
  
  openImage(imageKey:string){
    this.imageUrl = this.mediaService.getImageUrl(MediaFunction.LIVEWIRE_MEDIA,imageKey);
    $('#open-image-modal').modal("show");
    console.log("Open my image....",imageKey);
  }
  
  openHeadlineModal(headline:string){
    this.headline = headline;
    $('#change-headline-modal').modal("show");
  }
  
  openDescriptionModal(description:string){
    this.desc = description;
    $('#change-description-modal').modal("show");
  }
  
  updateHeadline(headline:string){
    this.liveWireAlertService.updateAlertHeadline(this.alertUid,headline).subscribe(resp => {
      console.log("Resp updated...",resp);
      $('#change-headline-modal').modal("hide");
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
    },error => {
      console.log("Error updating headline...",error);
    });
    console.log("Headline.....",headline);
  }
  
  updateDescription(description:string){
    this.liveWireAlertService.updateAlertDescription(this.alertUid,description).subscribe(resp => {
      console.log("Update response......",resp);
      $('#change-description-modal').modal("hide");
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
    },error=> {
      console.log("Error updating alert description...",error);
    });
    console.log("Desc.....",description);
  }
  
  deleteImage(imageUid:string){
    this.liveWireAlertService.deleteAlertImage(imageUid,this.alertUid).subscribe(resp => {
      console.log("Deleted image...",resp);
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
    }, error =>{
      console.log("Error deleting image...",error);
    });
    console.log("Delete it..............",imageUid);
  }
  
  uploadImages(event,input:any){
     let images = [].slice.call(event.target.files);
     console.log("Images....",images);
     this.saveImage(images);
  }

  saveImage(images){
     if(images.length > 0){
        console.log("Images uploaded..",images.length);
        
        let formData: FormData = new FormData();
        
        for(let image of images){
          formData.append("file", image, image.name);
          this.liveWireAlertService.uploadAlertImage(formData).subscribe(resp =>{
            console.log("Resp",resp);
            this.imageKeys.push(resp.data);
            this.updateAlert(this.imageKeys);
            formData = new FormData();
          },error =>{
            console.log("Error loading image");
          })
        }
        console.log("Image keys.....",this.imageKeys);
        
        console.log("formdata: ", formData);
     }
  }
  
  updateAlert(imageKeys:string[]){
    this.liveWireAlertService.updateAlertImages(this.alertUid,this.imageKeys).subscribe(resp => {
      console.log("Data from server........",resp);
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
    },error =>{
      console.log("Error adding images to alert.....",error);
    });
  }
  
  openTagsModal(serverUid:string){
    $('#tags-modal').modal("show");
  }
  
  addTags(tags:string){
    console.log("Tags...",tags);
    this.liveWireAlertService.tagAlert(this.alertUid,tags).subscribe(resp => {
      console.log("Tagged alert...",resp);
      $('#tags-modal').modal("hide");
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
    },error => {
      console.log("Error tagging alert....",error);
    });
  }

  blockAlert(serverUid:string){
    this.liveWireAlertService.blockAlert(this.alertUid).subscribe(resp =>{
      console.log("Blocked alert...",resp);
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
    },error =>{
      console.log("Error blocking alert.....",error);
    });
  }
  
  openReleaseModal(){
    console.log("release..............................");
    this.liveWireAlertService.getSubscribers().subscribe(resp => {
      console.log("Subscribers from server.....",resp);
      this.subscribers = resp;
    },error => {
      console.log("Error loading subscribers......",error);
    });
    $('#release-modal').modal("show");
  }
  
  selectedSubscribers(event:any,uid:string){
    console.log("Check event.............",event);
    console.log("Subscriber id.............",uid);
  }
}
