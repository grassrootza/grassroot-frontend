import { PublicLivewire } from "../../livewire/public-livewire.model";
import { MediaFunction } from "../../media/media-function.enum";
import { MediaService } from "../../media/media.service";
import { DateTimeUtils } from "../../utils/DateTimeUtils";
import { NewsServiceService } from "../news-service.service";
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

declare var $: any;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public news:PublicLivewire[]=[];
  public oldPosts:PublicLivewire[] = [];
  public latestPosts:PublicLivewire[] = [];
  
  public showOlder:boolean = false;
  public showLatest:boolean = true;
  
  public pageNumber:number = 0;
  public totalPages:number;
  
  public imageUrl:string;
  
  constructor(private newsService:NewsServiceService,
              private mediaService:MediaService) { }

  ngOnInit() {
    this.loadNews(this.pageNumber);
  }
  
  loadNews(pageNumber:number){
    this.newsService.loadNews(pageNumber).subscribe(news =>{
        console.log("Server response...",news);
        this.news = news.content;
        this.totalPages = news.totalPages;
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
