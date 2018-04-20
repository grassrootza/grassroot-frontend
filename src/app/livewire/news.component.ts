import {isPlatformBrowser} from "@angular/common";
import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {PublicLivewire} from "./public-livewire.model";
import {MediaFunction} from "../media/media-function.enum";
import {MediaService} from "../media/media.service";
import {PublicNewsService} from "../landing/public-news.service";

declare var $: any;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  public news:PublicLivewire[]=[];

  public showLatest:boolean = true;

  public pageNumber:number = 0;
  public totalPages:number;

  public imageUrl:string;

  public alertUid:string = "";
  public outPageNumber:number;

  public loadFromOutside:boolean = false;

  constructor(private newsService: PublicNewsService,
              private mediaService:MediaService,
              private route:ActivatedRoute,
              @Inject(PLATFORM_ID) protected platformId: Object) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params) => {
      this.alertUid = params['id'];
      console.log("Alert uid",this.alertUid);
      if (this.alertUid){
        this.loadFromOutside = true;
        this.loadAndScrollToAlert(this.alertUid);
      } else {
        this.loadNews(this.pageNumber);
      }
    });
  }

  loadAndScrollToAlert(alertUid:string){
    this.newsService.findAlertPageNumber(alertUid).subscribe(resp => {
      console.log("Page number....",resp);
      this.outPageNumber = resp;
      this.loadNews(this.outPageNumber, alertUid);
    },error => {
      console.log("Error finding alert page number",error);
    });
  }

  loadNews(pageNumber: number = 0, alertUid?: string) {
    this.newsService.loadNews(pageNumber).subscribe(news => {
        this.news = news.content;
        this.totalPages = news.totalPages;
        if (alertUid && isPlatformBrowser(this.platformId)) {
          setTimeout(() => NewsComponent.scrollToAlert(alertUid), 100);
        }
    },error =>{
      console.log("Error loading news.....",error);
    });
  }

  private static scrollToAlert(alertUid: string) {
    console.log("Scrolling to alert");
    const element = document.querySelector('#' + alertUid);
    if (element) {
      element.scrollIntoView();
      window.scrollBy(0, -75); // for navbar
    }
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
  }
}
