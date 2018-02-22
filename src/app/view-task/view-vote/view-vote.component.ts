import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../../task/task.model";

@Component({
  selector: 'app-view-vote',
  templateUrl: './view-vote.component.html',
  styleUrls: ['./view-vote.component.css']
})
export class ViewVoteComponent implements OnInit {

  @Input()
  public taskToView:Task;
  constructor() { }

  ngOnInit() {
  }

}
