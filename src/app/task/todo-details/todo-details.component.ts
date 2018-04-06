import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {TaskService} from "../task.service";
import {Task} from "../task.model";
import {convertResponseMap, TaskResponse} from "../task-response";
import {AlertService} from "../../utils/alert-service/alert.service";
import {TodoType} from "../todo-type";
import { saveAs } from 'file-saver';
import {TaskType} from "../task-type";

declare var $: any;

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

  public returnToGroup: boolean;
  public notifyCancellation = 'false';

  public responseClasses = {
    yes: 'fas fa-check',
    no: 'fas fa-times'
  };

  constructor(private route: ActivatedRoute,
              private alertService: AlertService,
              private taskService: TaskService,
              private router: Router) {}

  ngOnInit() {
    this.alertService.hideLoadingDelayed();
    this.route.params.subscribe((params:Params)=>{
      this.todoUid = params['id'];
      this.loadTodo();
      this.fetchTodoResponses();
    }, error => {
      console.log("Error retrieving paramaters");
    });

    this.route.queryParams.subscribe((queryParams: Params) => {
      let groupFlag = queryParams['returnToGroup'];
      if (groupFlag)
        this.returnToGroup = true;
    })
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

  confirmCancel() {
    $("#confirm-cancel-modal").modal('show');
  }

  cancelTodo() {
    console.log("notify cancellation: ", (this.notifyCancellation == 'true'));
    this.taskService.cancelTask(this.todoUid, TaskType.TODO, (this.notifyCancellation == 'true'), !this.returnToGroup).subscribe(response => {
      console.log("done! todo cancelled, response: ", response);
      $("#confirm-cancel-modal").modal('hide');
      this.alertService.alert('task.todo.cancel.done', true);
      this.routeToParent();
    })
  }

  routeToParent() {
    if (this.returnToGroup)
      this.router.navigate(['/group', this.todo.parentUid]);
    else
      this.router.navigate(['/home']);
    return false;
  }

  downloadEventErrorReport() {
    this.taskService.downloadBroadcastErrorReport(this.todo.type, this.todoUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      saveAs(blob, "task-error-report.xls");
    }, error => {
      console.log("error getting the file: ", error);
    });
  }

}
