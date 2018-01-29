import {Component, OnInit} from '@angular/core';
import {BroadcastContent, BroadcastTypes} from "../../model/broadcast-request";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BroadcastService} from "../../broadcast.service";

/*
todo : add these back when can figure out CLI weirdness
'https://cdn.quilljs.com/1.2.2/quill.snow.css', 'https://cdn.quilljs.com/1.2.2/quill.bubble.css',
 */
@Component({
  selector: 'app-broadcast-content',
  templateUrl: './broadcast-content.component.html',
  styleUrls: ['./broadcast-content.component.css',
    '../broadcast-create.component.css']
})
export class BroadcastContentComponent implements OnInit {

  types: BroadcastTypes;
  content: BroadcastContent;
  contentForm: FormGroup;

  MAX_SMS_LENGTH: number = 160;
  public smsCharsLeft: number = this.MAX_SMS_LENGTH;

  MAX_SOCIAL_LENGTH: number=  240; // using Twitter, but enforcing good posting practice on FB
  public fbCharsLeft: number = this.MAX_SOCIAL_LENGTH;
  public twCharsLeft: number = this.MAX_SOCIAL_LENGTH;

  constructor(private router: Router, private formBuilder: FormBuilder, private broadcastService: BroadcastService) {
    this.contentForm = formBuilder.group(new BroadcastContent());
  }

  ngOnInit() {
    this.types = this.broadcastService.getTypes();
    this.contentForm.setValue(this.broadcastService.getContent());
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
    this.broadcastService.setContent(this.contentForm.value);
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
    this.broadcastService.setContent(this.contentForm.value);
    this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'types']);
  }

  cancel() {
    this.broadcastService.cancelCurrentCreate();
  }

  uploadImage(event) {
    let images = event.target.files;

    if (images.length > 0) {
      let image = images[0];
      let formData: FormData = new FormData();
      formData.append("image", image, image.name);
      console.log("attempting to upload image ... name: ", image.name);
      this.broadcastService.uploadImage(formData).
      subscribe(response => {
          console.log("response: ", response);
        },
        error => {
          console.log("error uploading image, error: ", error);
        })
    }
  }

}
