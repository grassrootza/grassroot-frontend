import { MediaFunction } from "../../media/media-function.enum";
import { MediaService } from "../../media/media.service";
import { LiveWireAlert } from "../live-wire-alert.model";
import { LiveWireAlertService } from "../live-wire-alert.service";
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";

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
  
  constructor(private route:ActivatedRoute,
              private liveWireAlertService:LiveWireAlertService,
              private mediaService:MediaService) { }

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
  
   openImage(imageKey:string){
    this.imageUrl = this.mediaService.getImageUrl(MediaFunction.LIVEWIRE_MEDIA,imageKey);
    $('#open-image-modal').modal("show");
    console.log("Open my image....",imageKey);
  }

}
