import {isPlatformBrowser} from "@angular/common";
import {Component, Inject, OnInit, PLATFORM_ID, AfterViewChecked, ViewChild, ViewChildren, QueryList, AfterViewInit} from '@angular/core';
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
export class NewsComponent implements OnInit, AfterViewInit {

  @ViewChildren('alerts') alerts: QueryList<any>;

  public news: PublicLivewire[]=[];

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
      if (this.alertUid)
        this.newsService.findAlertPageNumber(this.alertUid).subscribe(pageNumber => this.loadNews(pageNumber));
      else
        this.loadNews();
    });
  }

  loadNews(pageNumber: number = 0) {
    this.newsService.loadNews(pageNumber).subscribe(news => {
        this.news = news.content;
        this.totalPages = news.totalPages;
        // setTimeout(() => this.finishedLoading(), 500);
    }, error =>{
      console.log("Error loading news.....",error);
    });
  }

  ngAfterViewInit() {
    this.alerts.changes.subscribe(t => {
      console.log('Changes triggered on alert view chilren!');
      this.finishedLoading();
    })
  }

  finishedLoading() {
    console.log('Should be finished loading, scrolling down ...');
    if (this.alertUid && isPlatformBrowser(this.platformId)) {
      console.log("Scrolling to alert");
      const element = document.getElementById(this.alertUid);
      if (element) {
        element.scrollIntoView();
        window.scrollBy(0, -75); // for navbar
      }
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
  
  trackElement(index: number, element: PublicLivewire) {
    return element ? element.serverUid : null;
  }

}
