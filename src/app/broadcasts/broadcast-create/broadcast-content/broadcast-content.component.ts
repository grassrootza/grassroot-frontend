import {Component, OnInit} from '@angular/core';
import {BroadcastContent, BroadcastTypes} from "../../model/broadcast-request";
import {FormBuilder, FormGroup} from "@angular/forms";
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
    this.types = broadcastService.getTypes();
    console.log("created content component, types set as = ", this.types);
  }

  ngOnInit() {
    this.contentForm.setValue(this.broadcastService.getContent());
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
