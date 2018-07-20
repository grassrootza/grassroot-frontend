import { Component, OnInit, Input } from '@angular/core';
import { Broadcast } from '../../broadcasts/model/broadcast';

@Component({
  selector: 'app-broadcast-view',
  templateUrl: './broadcast-view.component.html',
  styleUrls: ['./broadcast-view.component.css']
})
export class BroadcastViewComponent implements OnInit {

  @Input() modalBroadcast: Broadcast;
  public firstModalTab: string = 'sms';

  constructor() { }

  ngOnInit() {
    this.firstModalTab = this.modalBroadcast.smsContent ? 'sms' : this.modalBroadcast.emailContent ? 'email' : this.modalBroadcast.fbPost ? 'facebook' : 'twitter';
  }

}
