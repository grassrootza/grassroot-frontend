import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Broadcast } from '../../broadcasts/model/broadcast';

@Component({
  selector: 'app-broadcast-listing',
  templateUrl: './broadcast-listing.component.html',
  styleUrls: ['./broadcast-listing.component.css']
})
export class BroadcastListingComponent implements OnInit {

  @Input() broadcast: Broadcast;

  @Output() 
  public onViewDetailsClicked: EventEmitter<Broadcast> = new EventEmitter();

  @Output()
  public onResendClicked: EventEmitter<Broadcast> = new EventEmitter();

  @Output()
  public onDownloadErrorsClicked: EventEmitter<Broadcast>  = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public showViewModal() {
    this.onViewDetailsClicked.emit(this.broadcast);
  }

  public showResendModal() {
    this.onResendClicked.emit(this.broadcast);
  }

  public donwloadBroadcastErrorReport() {
    console.log('broadcast error clicked');
    this.onDownloadErrorsClicked.emit(this.broadcast);
  }

}
