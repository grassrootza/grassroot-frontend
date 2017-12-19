import {Component, Input, OnInit} from '@angular/core';
import {MembersPage} from "../../../model/membership.model";

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

  @Input()
  public currentPage: MembersPage = null;

  constructor() {
  }

  ngOnInit() {
  }


  public selectAllOnPage(event): void {
    let target = event.target || event.srcElement || event.currentTarget;
    let shouldSelectAll = target.checked;

    this.currentPage.content.forEach(m => m.selected = shouldSelectAll);
  }

}
