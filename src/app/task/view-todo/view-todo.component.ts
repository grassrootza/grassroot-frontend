import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TaskService} from "../task.service";
import {TodoType} from "../todo-type";
import {Task} from "../task.model";
import {AlertService} from "../../utils/alert.service";
import {Router} from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-view-todo',
  templateUrl: './view-todo.component.html',
  styleUrls: ['./view-todo.component.css']
})
export class ViewTodoComponent implements OnInit {

  public completeActionForm: FormGroup;

  @Input()
  public todoTask: Task = null;

  public todoTypeInfoRequired = TodoType.INFORMATION_REQUIRED;
  public todoTypeVolunteersNedded = TodoType.VOLUNTEERS_NEEDED;
  public todoTypeValidationRequired = TodoType.VALIDATION_REQUIRED;

  private RESPONSE_YES = "Yes";
  private RESPONSE_NO = "No";

  constructor(private taskService: TaskService,
              private alertService: AlertService,
              private router: Router,
              private formBuilder: FormBuilder) {

    this.completeActionForm = formBuilder.group({
      'information': ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  completeAction() {
    console.log("Completing action");
    if (this.completeActionForm.valid) {

      $('#view-todo-modal').modal("hide");

      let response = this.completeActionForm.get("information").value;
      this.taskService.respondToDo(this.todoTask.taskUid, response)
        .subscribe(
          resp => {
            console.log("Complete action success, response: ", resp);
            this.alertService.alert("task.todo.respondModal.responded");
          },
          error => console.log("Complete action failed: ", error)
        );
    }
  }

  respondYes() {
    $('#view-todo-modal').modal("hide");
    this.taskService.respondToDo(this.todoTask.taskUid, this.RESPONSE_YES)
      .subscribe(
        resp => {
          console.log("Complete action success, response: ", resp);
          this.alertService.alert("task.todo.respondModal.responded");
        },
        error => console.log("Complete action failed: ", error)
      );
  }

  respondNo() {
    $('#view-todo-modal').modal("hide");
    this.taskService.respondToDo(this.todoTask.taskUid, this.RESPONSE_NO)
      .subscribe(
        resp => console.log("Complete action success, response: ", resp),
        error => console.log("Complete action failed: ", error)
      );
  }

  clearData() {
    this.completeActionForm.controls['information'].reset('', { onlySelf: true });
  }

  viewAllResponses(){
    $("#view-todo-modal").modal("hide");
    this.router.navigate(['/task/todo', this.todoTask.taskUid]);
    return false;
  }

}
