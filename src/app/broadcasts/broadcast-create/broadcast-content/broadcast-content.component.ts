import {Component, OnInit} from '@angular/core';
import {BroadcastContent, BroadcastTypes} from "../../model/broadcast-request";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BroadcastService} from "../../broadcast.service";
import {BroadcastParams} from "../../model/broadcast-params";

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
  private twitterImageKey: string = "";

  constructor(private router: Router, private formBuilder: FormBuilder, private broadcastService: BroadcastService) {
    this.contentForm = formBuilder.group(new BroadcastContent());
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
    this.content.twitterImageKey = this.twitterImageKey;
    this.broadcastService.setContent(this.content);
  }

  cancel() {
    this.broadcastService.cancelCurrentCreate();
  }

  uploadImage(event, providerId) {
    let images = event.target.files;

    if (images.length > 0) {
      let image = images[0];
      let formData: FormData = new FormData();
      formData.append("image", image, image.name);
      this.broadcastService.uploadImage(formData).
      subscribe(response => {
          if (providerId == 'facebook') {
            this.fbImageKey = response;
          } else if (providerId == 'twitter') {
            this.twitterImageKey = response;
          }
        },
        error => {
          console.log("error uploading image, error: ", error);
        })
    }
  }

}
