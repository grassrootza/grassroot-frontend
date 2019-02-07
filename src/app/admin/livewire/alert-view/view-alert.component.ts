import {MediaFunction} from "../../../media/media-function.enum";
import {MediaService} from "../../../media/media.service";
import {IntegrationsService} from "../../../user/integrations/integrations.service";
import {UserService} from "../../../user/user.service";
import {DataSubscriber} from "../model/data-subscriber.model";
import {LiveWireAlert} from "../../../livewire/live-wire-alert.model";
import {FacebookPost} from "../model/facebook-post.model";
import {TwitterPost} from "../model/twitter-post.model";
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {LiveWireAdminService} from "../livewire-admin-service";
import { AlertService } from "../../../utils/alert-service/alert.service";

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
  public subscriberUids:string[] = [];
  public subscribers:DataSubscriber[] = [];
  public shareOnFB:boolean = false;
  public shareOnTwitter:boolean = false;
  public showDescription = false;
  public descriptionText: string = '';
  private linkUrl:string = "";
  private linkName:string = "grassroor news";
  public quillConfig: any;

  constructor(private route:ActivatedRoute,
              private liveWireAlertService:LiveWireAdminService,
              private mediaService:MediaService,
              private router:Router,
              private userService:UserService,
              private alertService:AlertService) {
    this.router.routeReuseStrategy.shouldReuseRoute = function(){
      return false;
    }
  }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      this.alertUid = params['id'];
      this.linkUrl = "www.grassroot.org.za/news/" + this.alertUid;
      this.loadAlert(this.alertUid);
    },error=>{
      console.log("Error getting params....",error);
    });
    // basic Quill config for description (no media, no complex formatting)
    this.quillConfig = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        ['clean'],                                         // remove formatting button
      ]
    };
  }

  cancelEditDescription() {
    this.showDescription = false;
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

  onEditDescriptionClick() {
    if (this.showDescription) {
      this.updateDescription(this.descriptionText);
    }
    this.showDescription = !this.showDescription;
  }

  getEditDescriptionText(): string {
    return this.showDescription ? 'Save' : 'Edit';
  }

  updateHeadline(headline:string){
    this.liveWireAlertService.updateAlertHeadline(this.alertUid,headline).subscribe(resp => {
      console.log("Resp updated...",resp);
      $('#change-headline-modal').modal("hide");
      this.refreshComponent();
    },error => {
      console.log("Error updating headline...",error);
    });
    console.log("Headline.....",headline);
  }

  updateDescription(description:string){
    this.liveWireAlertService.updateAlertDescription(this.alertUid,description).subscribe(resp => {
      console.log("Update response......",resp);
      $('#change-description-modal').modal("hide");
      this.refreshComponent();
    },error=> {
      console.log("Error updating alert description...",error);
    });
    console.log("Desc.....",description);
  }

  deleteImage(imageUid:string){
    this.liveWireAlertService.deleteAlertImage(imageUid,this.alertUid).subscribe(resp => {
      console.log("Deleted image...",resp);
      this.refreshComponent();
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
      this.refreshComponent();
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
      this.refreshComponent();
    },error => {
      console.log("Error tagging alert....",error);
    });
  }

  blockAlert(serverUid:string){
    this.liveWireAlertService.blockAlert(this.alertUid).subscribe(() =>{
      this.refreshComponent();
    },error =>{
      console.log("Error blocking alert.....",error);
    });
  }

  openReleaseModal(){
    this.liveWireAlertService.getSubscribers().subscribe(resp => {
      this.subscribers = resp;
    },error => {
      console.log("Error loading subscribers......",error);
    });
    $('#release-modal').modal("show");
  }

  selectedSubscribers(event:any,uid:string){
    event == true ? this.addSubscriberUid(uid) : this.removeSubscriberUid(uid);
    console.log("Subscriber uids...........",this.subscriberUids);
  }

  addSubscriberUid(uid:string){
    this.subscriberUids.push(uid);
  }

  removeSubscriberUid(uid:string){
    if(this.subscriberUids.indexOf(uid) !== -1){
      this.subscriberUids.splice(this.subscriberUids.indexOf(uid),1);
    }
  }

  releaseAlert(){
    console.log("Data subscriber list in release method.....", this.subscriberUids);
    this.liveWireAlertService.releaseAlert(this.alertUid,this.subscriberUids).subscribe(resp => {
      this.alertService.alert('livewire.view-alert.released');
      if( this.shareOnFB){
        this.shareAlertOnFacebook(this.liveWireAlert);
      }

      if (this.shareOnTwitter){
        this.shareAlertOnTwitter(this.liveWireAlert);
      }

      $('#release-modal').modal("hide");
      this.refreshComponent();
    },error => {
      console.log("Error releasing alert.....",error);
    });
  }

  refreshComponent(){
      this.router.navigated = false;
      this.router.navigate([this.router.url]);
  }

  facebookEvent(event,media){
    console.log("Media....",event + " " + media);
    this.shareOnFB = event;
    //this.shareFB(this.liveWireAlert);
  }

  tweetEvent(event,twitter){
    console.log("Media....",event + " " + twitter);
    this.shareOnTwitter = event;
    //this.shareAlertOnTwitter(this.liveWireAlert);
  }

  shareAlertOnFacebook(alert:LiveWireAlert){
    let post = new FacebookPost(this.userService.getLoggedInUser().userUid,
                                "",alert.description,this.linkUrl,this.linkName,alert.mediaFileKeys[0],MediaFunction.LIVEWIRE_MEDIA,alert.mediaFileKeys[0]);
    let posts:FacebookPost[] = [];
    posts.push(post);
    this.liveWireAlertService.postOnFB(post).subscribe(resp => {
      console.log("Posted on FB",resp);
    },error => {
      console.log("Error sharing on FB",error);
    });
  }

  shareAlertOnTwitter(alert:LiveWireAlert){
    let tweet = new TwitterPost(this.userService.getLoggedInUser().userUid,alert.description,MediaFunction.LIVEWIRE_MEDIA,alert.mediaFileKeys[0]);
    this.liveWireAlertService.postOnTwitter(tweet).subscribe(resp => {
      console.log("Posted on twitter......",resp);
    },error => {
      console.log("Error twitting......",error);
    });
  }
}
