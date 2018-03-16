import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {TaskService} from "../task.service";
import {Task} from "../task.model";
import {convertResponseMap, TaskResponse} from "../task-response";
import {AlertService} from "../../utils/alert.service";
import {TodoType} from "../todo-type";
import {saveAs} from 'file-saver/FileSaver';

const RESP_ORDER = {
  'YES': 2, 'NO': 1, '': 1
};

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.component.html',
  styleUrls: ['./todo-details.component.css']
})
export class TodoDetailsComponent implements OnInit {

  public todoUid: string = "";
  public todo: Task;
  public todoResponses: TaskResponse[];

  public typeInfo = TodoType.INFORMATION_REQUIRED;
  public typeVolunteer = TodoType.VOLUNTEERS_NEEDED;
  public typeValidation = TodoType.VALIDATION_REQUIRED;

  public responseClasses = {
    yes: 'fas fa-check',
    no: 'fas fa-times'
  };

  constructor(private route: ActivatedRoute,
              private alertService: AlertService,
              private taskService: TaskService) {}

  ngOnInit() {
    this.alertService.hideLoadingDelayed();
    this.route.params.subscribe((params:Params)=>{
      this.todoUid = params['id'];
      this.loadTodo();
      this.fetchTodoResponses();
    }, error => {
      console.log("Error retrieving paramaters");
    });
  }

  loadTodo() {
    this.taskService.loadTask(this.todoUid, "TODO").subscribe(todo => {
      this.todo = todo;
    });
  }

  fetchTodoResponses() {
    this.taskService.fetchTodoResponses(this.todoUid).subscribe(responses => {
      console.log("here is the response map: ", responses);
      this.todoResponses = convertResponseMap(responses);
      this.todoResponses.sort((task1, task2) => {
        if (task1.response == task2.response)
          return task1.memberName > task2.memberName ? 1 : task2.memberName > task1.memberName ? -1 : 0;
        else
          return RESP_ORDER[task1.response] > RESP_ORDER[task2.response] ? -1 : 1;
      });
    })
  }

  downloadResponses() {
    this.taskService.downloadTodoResponses(this.todoUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      saveAs(blob, this.todo.title.replace(/ /g, "_").toLowerCase() + "_responses.xlsx");
    }, error => {
      console.log("error downloading todo responses: ", error);
    })
  }

}
