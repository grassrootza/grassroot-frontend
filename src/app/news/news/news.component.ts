import { PublicLivewire } from "../../livewire/public-livewire.model";
import { MediaFunction } from "../../media/media-function.enum";
import { MediaService } from "../../media/media.service";
import { DateTimeUtils } from "../../utils/DateTimeUtils";
import { NewsServiceService } from "../news-service.service";
import { Component, OnInit } from '@angular/core';
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
  
  constructor(private newsService:NewsServiceService,
              private mediaService:MediaService,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.loadNews(this.pageNumber);
    this.route.params.subscribe((params:Params) => {
      this.alertUid = params['id'];
    });
    
    
    if(this.alertUid !== '0'){
      console.log("Alert uid .... Out load",this.alertUid);
      this.loadAlert(this.alertUid);
    }else{
      console.log("Load news inside") 
    }
  }
  
  loadNews(pageNumber:number){
    this.newsService.loadNews(pageNumber).subscribe(news =>{
        console.log("Server response...",news);
        this.news = news.content;
        this.firstAlert = news.content.find(alert => alert.serverUid == this.alertUid);
        this.alertIndex = this.news.indexOf(this.firstAlert);
        console.log("Alert index@@@@@@@@@@@@@@",this.alertIndex);
        this.totalPages = news.totalPages;
    },error =>{
      console.log("Error loading news.....",error);
    });
  }
  
  loadAlert(alertUid:string){
    this.newsService.loadAlert(alertUid).subscribe(resp => {
      this.firstAlert = resp;
      console.log("Alert loaded.....",this.firstAlert);
    },error => {
      console.log("Error loading alert.....",error);
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
