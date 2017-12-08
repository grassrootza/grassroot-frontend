import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupInfo} from "../model/group-info.model";

@Component({
  selector: 'app-group-info',
  templateUrl: './group-info.component.html',
  styleUrls: ['./group-info.component.css']
})
export class GroupInfoComponent implements OnInit {

  @Input()
  public group: GroupInfo = null;

  @Output()
  public pinToggled: EventEmitter<GroupInfo> = new EventEmitter(null);

  @Input()
  public extendedInfoVisible = false;

  constructor() {
  }

  ngOnInit() {
  }

  handlePinClick() {
    this.pinToggled.emit(this.group);
  }

  hadleChevronPicked(){
    this.extendedInfoVisible = !this.extendedInfoVisible;
  }

}
