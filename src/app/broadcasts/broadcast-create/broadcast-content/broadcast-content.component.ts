import {Component, OnInit} from '@angular/core';
import {BroadcastContent, BroadcastTypes} from "../../model/broadcast-request";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {BroadcastService} from "../../broadcast.service";

@Component({
  selector: 'app-broadcast-content',
  templateUrl: './broadcast-content.component.html',
  styleUrls: ['./broadcast-content.component.css']
})
export class BroadcastContentComponent implements OnInit {

  types: BroadcastTypes;
  content: BroadcastContent;
  contentForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private broadcastService: BroadcastService) {
    this.contentForm = formBuilder.group(new BroadcastContent());
  }

  ngOnInit() {
    this.types = this.broadcastService.getTypes();
    this.contentForm.setValue(this.broadcastService.getContent());
    this.setUpValidation();
  }

  setUpValidation() {
    this.contentForm.controls['title'].setValidators([Validators.required]);
    if (this.types.shortMessage) { this.contentForm.controls['shortMessage'].setValidators([Validators.required]); }
    if (this.types.email) { this.contentForm.controls['emailContent'].setValidators([Validators.required]); }
    if (this.types.facebook) { this.contentForm.controls['facebookPost'].setValidators([Validators.required]); }
    if (this.types.twitter) { this.contentForm.controls['twitterPost'].setValidators([Validators.required]); }
  }

  // todo : probably want some form of caching / save draft
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
      this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'members']);
    }
  }

  back() {
    // we don't care if it's valid or not, but do want to stash it
    this.broadcastService.setContent(this.contentForm.value);
    this.router.navigate(['/broadcast/create/', this.broadcastService.currentType(), this.broadcastService.parentId(), 'types']);
  }

  cancel() {
    this.router.navigate([this.broadcastService.cancelRoute()]);
  }

}
