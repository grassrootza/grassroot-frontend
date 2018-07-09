import {Component, OnInit} from '@angular/core';
import {BroadcastContent, BroadcastTypes} from "../../model/broadcast-request";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BroadcastService} from "../../broadcast.service";
import {BroadcastParams} from "../../model/broadcast-params";
import {optionalUrlValidator} from "../../../validators/CustomValidators";
import {environment} from "environments/environment";
import {Ng2ImgMaxService} from "ng2-img-max";
import {AlertService} from "../../../utils/alert-service/alert.service";
import {limitImageSizesInRichText} from "../../../media/media-utils";
import {MediaService} from "../../../media/media.service";
import {MediaFunction} from "../../../media/media-function.enum";

declare var $: any;

@Component({
  selector: 'app-broadcast-content',
  templateUrl: './broadcast-content.component.html',
  styleUrls: ['./broadcast-content.component.css',
    '../broadcast-create.component.css']
})
export class BroadcastContentComponent implements OnInit {

  types: BroadcastTypes;
  params: BroadcastParams;

  content: BroadcastContent;
  contentForm: FormGroup;

  MAX_SMS_LENGTH: number = 160;
  public smsCharsLeft: number = this.MAX_SMS_LENGTH;

  MAX_FB_LENGTH: number = 600;
  MAX_TWITTER_LENGTH: number=  240; // using Twitter, but enforcing good posting practice on FB
  public fbCharsLeft: number = this.MAX_FB_LENGTH;
  public twCharsLeft: number = this.MAX_TWITTER_LENGTH;

  private emailAttachmentKeys: string[] = [];

  private fbImageKey: string = "";
  public fbImageUrl: string = "";
  public fbLink: string = "";
  private fbLinkCaption: string = "";

  private twitterImageKey: string = "";
  public twitterImageUrl: string = "";
  public twitterLink: string = "";
  private twitterLinkCaption: string = "";

  private lastLinkInserted: string = "";
  private lastLinkCaption: string = "";

  linkForm: FormGroup;
  insertingLinkType: string;

  IMG_MAX = {'facebook': 476, 'twitter': 506};

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private broadcastService: BroadcastService,
              private mediaService: MediaService,
              private ng2ImgMax: Ng2ImgMaxService,
              private alertService: AlertService) {
    this.contentForm = formBuilder.group(new BroadcastContent());
    this.linkForm = formBuilder.group({
      'linkType': ['GROUP', Validators.required],
      'url': ['', optionalUrlValidator],
      'caption': ['', Validators.required]
    });
  }

  ngOnInit() {
    this.types = this.broadcastService.getTypes();
    this.params = this.broadcastService.getCreateParams();
    this.content = this.broadcastService.getContent();
    this.contentForm.setValue(this.content);
    this.setUpValidation();
    this.restorePriorAttachments();
  }

  restorePriorAttachments() {
    if (this.content.emailAttachmentKeys) {
      this.emailAttachmentKeys = this.content.emailAttachmentKeys;
    }
    if (this.content.facebookImageKey) {
      this.fbImageKey = this.content.facebookImageKey;
      this.fbImageUrl = environment.backendAppUrl + "/image/broadcast/" + this.fbImageKey;
    }
    if (this.content.facebookLink) {
      this.fbLink = this.content.facebookLink;
      this.fbLinkCaption = this.content.facebookLinkCaption;
    }
    if (this.content.twitterImageKey) {
      this.twitterImageKey = this.content.twitterImageKey;
      this.twitterImageUrl = environment.backendAppUrl + "/image/broadcast" + this.twitterImageKey;
    }
    if (this.content.twitterLink) {
      this.twitterLink = this.content.twitterLink;
      this.twitterLinkCaption = this.content.twitterLinkCaption;
    }
  }

  // todo : save things every few words
  keyUpShortMessage(event: any) {
    this.smsCharsLeft = this.MAX_SMS_LENGTH - event.target.value.length;
  }

  fbKeyUp(event: any) {
    this.fbCharsLeft = this.MAX_FB_LENGTH - event.target.value.length;
  }

  twKeyUp(event: any) {
    this.twCharsLeft = this.MAX_TWITTER_LENGTH - event.target.value.length;
  }

  setUpValidation() {
    this.contentForm.controls['title'].setValidators([Validators.required]);
    if (this.types.shortMessage) { this.contentForm.controls['shortMessage'].setValidators([Validators.required]); }
    if (this.types.email) { this.contentForm.controls['emailContent'].setValidators([Validators.required]); }
    if (this.types.facebook) { this.contentForm.controls['facebookPost'].setValidators([Validators.required]); }
    if (this.types.twitter) { this.contentForm.controls['twitterPost'].setValidators([Validators.required]); }
  }

  validateAndSaveContent() {
    if (!this.contentForm.valid) {
      return false;
    }
    this.saveContent();
    // console.log("stashed content for this broadcast, value = ", this.broadcastService.getContent());
    return true;
  }

  next() {
    if (this.validateAndSaveContent()) {
      this.broadcastService.setPageCompleted('content');
      this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'members']);
    }
  }

  back() {
    // we don't care if it's valid or not, but do want to stash it
    this.broadcastService.setContent(this.content);
    this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'types']);
  }

  saveContent() {
    this.content = this.contentForm.value;
    if (this.types.email) {
      this.content.emailContent = limitImageSizesInRichText(this.content.emailContent);
      this.content.emailAttachmentKeys = this.emailAttachmentKeys;
    }

    this.content.facebookImageKey = this.fbImageKey;
    this.content.facebookLink = this.fbLink;
    this.content.facebookLinkCaption = this.fbLinkCaption;

    this.content.twitterImageKey = this.twitterImageKey;
    this.content.twitterLink = this.twitterLink;
    this.content.twitterLinkCaption = this.twitterLinkCaption;

    this.broadcastService.setContent(this.content);
  }

  cancel() {
    this.broadcastService.cancelCurrentCreate();
  }

  chooseLink(contentType: string) {
    this.insertingLinkType = contentType;
    $("#insert-link-modal").modal("show");
  }

  insertMergeFieldEmail(event) {
    // console.log("event: ", event);
    this.contentForm.controls['emailContent'].patchValue(`${this.contentForm.controls['emailContent'].value} ${event.target.value}`);
    this.contentForm.controls['emailMergeField'].reset('', {onlySelf: true});
  }

  insertMergeFieldSms(mergeField: string) {
    this.contentForm.controls['shortMessage'].patchValue(`${this.contentForm.controls['shortMessage'].value} ${mergeField}`);
    this.contentForm.controls['smsMergeField'].reset('', {onlySelf: true});
  }

  insertLink() {
    this.lastLinkCaption = this.linkForm.controls['caption'].value;

    let linkType = this.linkForm.controls['linkType'].value;
    // console.log("link type: ", linkType);
    if (linkType === "OWN") {
      this.lastLinkInserted = this.linkForm.controls['url'].value;
    } else if (linkType === "GROUP") {
      this.lastLinkInserted = this.broadcastService.inboundGroupUrl(this.broadcastService.parentId());
    }

    console.log("link inserted = ", this.lastLinkInserted);

    switch (this.insertingLinkType) {
      case 'email':
        this.addLinkToEmail(this.lastLinkInserted, this.lastLinkCaption);
        break;
      case 'facebook':
        this.addFbLink(this.lastLinkInserted, this.lastLinkCaption);
        break;
      case 'twitter':
        this.addTwitterLink(this.lastLinkInserted, this.lastLinkCaption);
        break;
      case 'shortMessage':
        this.addShortMsgLink(this.lastLinkInserted);
        break;
    }

    $("#insert-link-modal").modal("hide");
    this.linkForm.reset();
  }

  addLinkToEmail(linkUrl: string, linkCaption: string) {
    let patchLink = `<a href="${linkUrl}">${linkCaption}</a>`;
    this.contentForm.controls['emailContent'].patchValue(`${this.contentForm.controls['emailContent'].value} ${patchLink}`)
  }

  addFbLink(fbLink: string, fbLinkCaption: string) {
    this.fbLink = fbLink;
    this.fbLinkCaption = fbLinkCaption;
  }

  addTwitterLink(twLink: string, twLinkCaption: string) {
    this.twitterLink = twLink;
    this.twitterLinkCaption = twLinkCaption;
  }

  addShortMsgLink(link: string) {
    this.alertService.showLoading();
    this.broadcastService.shortenLink(link).subscribe(shortLink => {
      this.alertService.hideLoading();
      this.contentForm.controls['shortMessage'].patchValue(`${this.contentForm.controls['shortMessage'].value} ${shortLink}`);
      this.lastLinkInserted = ""; // since without caption can't insert in other types
    }, error => {
      console.log("error! : ", error);
      this.alertService.hideLoading();
    });
  }

  uploadEmailAttachments(event) {
    let images = event.target.files;
    if (images.length > 0) {
      let image = images[0];
      console.log("file name ? : ", image.name);
      this.alertService.showLoading();
      this.mediaService.uploadMedia(image, MediaFunction.BROADCAST_IMAGE, image.type).subscribe(response => {
        this.alertService.hideLoadingDelayed(); // so img can pop upt
        this.emailAttachmentKeys.push(response);
      }, error => {
        this.alertService.hideLoading();
        console.log("error uploading image, error: ", error);
      });
    }
  }

  removeLastEmailAttachment() {
    console.log("current keys: ", this.emailAttachmentKeys);
    this.emailAttachmentKeys.pop();
    console.log("after removal: ", this.emailAttachmentKeys);
  }

  removeAllEmailAttachments() {
    this.emailAttachmentKeys = [];
  }

  uploadImage(event, providerId) {
    let images = event.target.files;

    if (images.length > 0) {
      let image = images[0];
      this.alertService.showLoading();
      this.ng2ImgMax.resizeImage(image, this.IMG_MAX[providerId], this.IMG_MAX['providerId'], true).subscribe(result => {
        let resizedImage = new File([result], result.name);
        // need to pass type in here as resize image passes it back with octet-stream
        this.mediaService.uploadMedia(resizedImage, MediaFunction.BROADCAST_IMAGE, image.type).subscribe(response => {
          this.alertService.hideLoadingDelayed(); // so img can pop upt
          console.log(`for provider id : ${providerId}, response: ${response}`);
          if (providerId == 'facebook') {
            this.fbImageKey = response;
            this.fbImageUrl = environment.backendAppUrl + "/image/broadcast/" + response;
          } else if (providerId == 'twitter') {
            this.twitterImageKey = response;
            this.twitterImageUrl = environment.backendAppUrl + "/image/broadcast/" + response;
          }
        }, error => {
          this.alertService.hideLoading();
          console.log("error uploading image, error: ", error);
        });

      });
    }
  }

}
