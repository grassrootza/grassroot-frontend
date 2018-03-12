import { PublicLivewire } from "../../livewire/public-livewire.model";
import { MediaFunction } from "../../media/media-function.enum";
import { MediaService } from "../../media/media.service";
import { DateTimeUtils } from "../../utils/DateTimeUtils";
import { NewsServiceService } from "../news-service.service";
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

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
  
  constructor(private newsService:NewsServiceService,
              private mediaService:MediaService) { }

  ngOnInit() {
    this.loadNews();
  }
  
  loadNews(){
    this.newsService.loadNews().subscribe(news =>{
        console.log("Server response...",news);
        this.news = news.content;
      
        this.oldPosts = news.content.filter(post => moment(post.creationTimeMillis).isBefore(moment().startOf('day')));
        
        this.latestPosts = news.content.filter(post => moment(post.creationTimeMillis).isSameOrAfter(moment().startOf('day')));
      
        console.log("Old....",this.oldPosts);
      
        console.log("Latest....",this.latestPosts);
        console.log("News loaded.....................................",this.news); 
    },error =>{
      console.log("Error loading news.....",error);
    });
  }
  
  loadImageUrl(alert:PublicLivewire):string{
    let imageKey:string;
    for(let key of alert.imageKeys){
      imageKey = key;
    }
    return this.mediaService.getImageUrl(MediaFunction.LIVEWIRE_MEDIA,imageKey);
  }
  
  showOlderPosts(){
    this.showOlder = true;
    this.showLatest = false;
  }
  
  showLatestPosts(){
    this.showLatest = true;
    this.showOlder = false;
  }

}
