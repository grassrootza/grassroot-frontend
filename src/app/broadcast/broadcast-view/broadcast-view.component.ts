import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Broadcast } from '../../broadcasts/model/broadcast';

@Component({
  selector: 'app-broadcast-view',
  templateUrl: './broadcast-view.component.html',
  styleUrls: ['./broadcast-view.component.css']
})
export class BroadcastViewComponent implements OnInit, OnChanges {

  @Input() modalBroadcast: Broadcast;
  public firstModalTab: string = 'sms';

  constructor() { }

  ngOnInit() {
    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['modalBroadcast'] && this.modalBroadcast) {
      this.firstModalTab = this.modalBroadcast.smsContent ? 'sms' : this.modalBroadcast.emailContent ? 'email' : this.modalBroadcast.fbPost ? 'facebook' : 'twitter';
    }
  }

}
