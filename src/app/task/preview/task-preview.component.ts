import { Component, OnInit, Input } from '@angular/core';
import { TaskPreview } from '../task-preview.model';

@Component({
  selector: 'app-task-preview',
  templateUrl: './task-preview.component.html',
  styleUrls: ['./task-preview.component.css']
})
export class TaskPreviewComponent implements OnInit {

  @Input() taskPreview: TaskPreview;

  constructor() { }

  ngOnInit() {
  }

}
