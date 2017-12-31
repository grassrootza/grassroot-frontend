import { Component, OnInit } from '@angular/core';
import {CampaignService} from "../campaign.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";

@Component({
  selector: 'app-campaign-create',
  templateUrl: './campaign-create.component.html',
  styleUrls: ['./campaign-create.component.css']
})
export class CampaignCreateComponent implements OnInit {

  public createCampaignForm: FormGroup;

  constructor(private campaignService: CampaignService, private formBuilder: FormBuilder,
              private spinnerService: Ng4LoadingSpinnerService) {

    this.createCampaignForm = this.formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': ['', Validators.compose([Validators.required, Validators.minLength(10)])],
    });
  }

  ngOnInit() {

  }

  createCampaign() {

  }

}
