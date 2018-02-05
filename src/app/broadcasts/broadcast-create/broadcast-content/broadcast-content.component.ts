import {Component, OnInit} from '@angular/core';
import {BroadcastContent, BroadcastTypes} from "../../model/broadcast-request";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BroadcastService} from "../../broadcast.service";
import {BroadcastParams} from "../../model/broadcast-params";
import {optionalUrlValidator} from "../../../utils/CustomValidators";
import {environment} from "../../../../environments/environment";
import {Ng2ImgMaxService} from "ng2-img-max";
import {AlertService} from "../../../utils/alert.service";

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

  MAX_SOCIAL_LENGTH: number=  240; // using Twitter, but enforcing good posting practice on FB
  public fbCharsLeft: number = this.MAX_SOCIAL_LENGTH;
  public twCharsLeft: number = this.MAX_SOCIAL_LENGTH;

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
  }

  // todo : save things every few words
  keyUpShortMessage(event: any) {
    this.smsCharsLeft = this.MAX_SMS_LENGTH - event.target.value.length;
  }

  fbKeyUp(event: any) {
    this.fbCharsLeft = this.MAX_SOCIAL_LENGTH - event.target.value.length;
  }

  twKeyUp(event: any) {
    this.twCharsLeft = this.MAX_SOCIAL_LENGTH - event.target.value.length;
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
    console.log("stashed content for this broadcast, value = ", this.broadcastService.getContent());
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

  insertLink() {
    this.lastLinkCaption = this.linkForm.controls['caption'].value;

    let linkType = this.linkForm.controls['linkType'].value;
    console.log("link type: ", linkType);
    if (linkType === "URL") {
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

  uploadImage(event, providerId) {
    let images = event.target.files;

    if (images.length > 0) {
      let image = images[0];
      this.alertService.showLoading();
      this.ng2ImgMax.resizeImage(image, this.IMG_MAX[providerId], this.IMG_MAX['providerId'], true).subscribe(result => {
        let formData: FormData = new FormData();
        let resizedImage = new File([result], result.name);
        formData.append("image", resizedImage, image.name);
        this.broadcastService.uploadImage(formData).subscribe(response => {
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
        })

      });
    }
  }

}
