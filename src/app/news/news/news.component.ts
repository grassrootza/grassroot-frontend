import { PublicLivewire } from "../../livewire/public-livewire.model";
import { MediaFunction } from "../../media/media-function.enum";
import { MediaService } from "../../media/media.service";
import { DateTimeUtils } from "../../utils/DateTimeUtils";
import { NewsServiceService } from "../news-service.service";
import { isPlatformBrowser } from "@angular/common";
import { Component, OnInit, Inject, PLATFORM_ID} from '@angular/core';
import { ActivatedRoute, Params } from "@angular/router";
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public news:PublicLivewire[]=[];
  
  public pageNumber:number = 0;
  public totalPages:number;
  
  public imageUrl:string;
  
  public alertUid:string = "";
  public firstAlert:PublicLivewire;
  public alertIndex:number;
  public outPageNumber:number;

  public loadFromOutside:boolean = false;

  
  constructor(private newsService:NewsServiceService,
              private mediaService:MediaService,
              private route:ActivatedRoute,
              @Inject(PLATFORM_ID) protected platformId: Object) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params) => {
      this.alertUid = params['id'];
      if(this.alertUid !== '0'){
        console.log("Alert uid .... Out load",this.alertUid);
        console.log("Alert uid",this.alertUid);
        this.loadFromOutside = true;
        this.loadAndScrollToAlert(this.alertUid);
      }else{
        console.log("Load news inside");
        this.loadNews(this.pageNumber);
      }
    });
  }
  
  loadAndScrollToAlert(alertuid:string){
    this.newsService.findAlertPageNumber(alertuid).subscribe(resp => {
      console.log("Page number....",resp);
      this.outPageNumber = resp;
      this.loadNews(this.outPageNumber);
    },error => {
      console.log("Error finding alert page number",error);
    });
  }
  
  loadNews(pageNumber:number) {
    this.newsService.loadNews(pageNumber).subscribe(news =>{
        console.log("Server response...",news);
        this.news = news.content;
        this.totalPages = news.totalPages;
        
        if(this.loadFromOutside){
          console.log("Loading from outside.....");
          if (isPlatformBrowser(this.platformId)){
            setTimeout(() => {
              var el = document.getElementById('target');
              document.querySelector('#target').scrollIntoView({behavior: 'smooth'});
            }, 2000)
          }
        }
        
    },error =>{
      console.log("Error loading news.....",error);
    });
  }
  
  
  loadImageUrl(imageKey:string):string{
    return this.mediaService.getImageUrl(MediaFunction.LIVEWIRE_MEDIA,imageKey);
  }
  
  showOlderPosts(){
    this.pageNumber += 1;
    if(this.pageNumber < this.totalPages -1){
      this.loadNews(this.pageNumber);
    }else{
      this.pageNumber = this.totalPages -1;
      this.loadNews(this.pageNumber);
    }
  }
  
  showLatestPosts(){
    this.pageNumber -= 1;
    if(this.pageNumber > 0){
       this.loadNews(this.pageNumber);
    }else{
      this.pageNumber = 0;
      this.loadNews(this.pageNumber);
    }
  }
  
  openImage(imageKey:string){
    this.imageUrl = this.mediaService.getImageUrl(MediaFunction.LIVEWIRE_MEDIA,imageKey);
    $('#open-image-modal').modal("show");
    console.log("Open my image....",imageKey);
  }
}
