import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../../task/task.model";

@Component({
  selector: 'app-view-todo',
  templateUrl: './view-todo.component.html',
  styleUrls: ['./view-todo.component.css']
})
export class ViewTodoComponent implements OnInit {

  @Input()
  public taskToView:Task;

  constructor() { }

  ngOnInit() {
  }

}
