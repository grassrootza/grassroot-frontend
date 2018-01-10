import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TaskService} from "../task.service";
import {TodoType} from "../todo-type";
import {Task} from "../task.model";
import {UserService} from "../../user/user.service";

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
    let response = this.completeActionForm.get("information").value;
    this.taskService.respondToDo(this.todoTask.taskUid, this.userService.getLoggedInUser().userUid, response);
  }

  ngOnInit() {
  }

}
