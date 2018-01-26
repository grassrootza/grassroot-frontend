import {Component, Input, OnInit} from '@angular/core';
import {CampaignInfo} from "../../model/campaign-info";

@Component({
  selector: 'app-campaign-info',
  templateUrl: './campaign-info.component.html',
  styleUrls: ['./campaign-info.component.css']
})
export class CampaignInfoComponent implements OnInit {

  @Input()
  public campaign: CampaignInfo = null;

  constructor() { }

  ngOnInit() {
  }

}
