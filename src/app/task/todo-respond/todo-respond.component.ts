import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TaskService} from "../task.service";
import {TodoType} from "../todo-type";
import {Task} from "../task.model";
import {UserService} from "../../user/user.service";

declare var $: any;

@Component({
  selector: 'app-todo-respond',
  templateUrl: './todo-respond.component.html',
  styleUrls: ['./todo-respond.component.css']
})
export class ToDoRespondComponent implements OnInit, OnChanges {

  public completeActionForm: FormGroup;

  @Input()
  public todoTask: Task = null;

  public todoTypeInfoRequired = TodoType.INFORMATION_REQUIRED;
  public todoTypeVolunteersNedded = TodoType.VOLUNTEERS_NEEDED;
  public todoTypeValidationRequired = TodoType.VALIDATION_REQUIRED;

  private RESPONSE_YES = "Yes";
  private RESPONSE_NO = "No";

  constructor(private taskService: TaskService,
              private userService: UserService,
              formBuilder: FormBuilder) {

    this.completeActionForm = formBuilder.group({
      'information': ['', Validators.required],
    });
  }


  ngOnChanges(changes: SimpleChanges): void {

    console.log("Changes , todoTask: ", this.todoTask);
  }

  completeAction() {
    console.log("Completing action");
    if (this.completeActionForm.valid) {

      $('#respond-todo-modal').modal("hide");

      let response = this.completeActionForm.get("information").value;
      this.taskService.respondToDo(this.todoTask.taskUid, this.userService.getLoggedInUser().userUid, response)
        .subscribe(
          resp => console.log("Complete action success, response: ", resp),
          error => console.log("Complete action failed: ", error)
        );
    }
  }

  respondYes() {
    console.log("Completing action Yes");
    $('#respond-todo-modal').modal("hide");
    this.taskService.respondToDo(this.todoTask.taskUid, this.userService.getLoggedInUser().userUid, this.RESPONSE_YES)
      .subscribe(
        resp => console.log("Complete action success, response: ", resp),
        error => console.log("Complete action failed: ", error)
      );
  }

  respondNo() {
    console.log("Completing action No");
    $('#respond-todo-modal').modal("hide");
    this.taskService.respondToDo(this.todoTask.taskUid, this.userService.getLoggedInUser().userUid, this.RESPONSE_NO)
      .subscribe(
        resp => console.log("Complete action success, response: ", resp),
        error => console.log("Complete action failed: ", error)
      );
  }

  ngOnInit() {
  }

}
