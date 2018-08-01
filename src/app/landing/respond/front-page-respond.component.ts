import {Component, OnInit} from "@angular/core";
import {UserService} from "../../user/user.service";
import {IncomingResponseService} from "../incoming-response.service";
import {environment} from "environments/environment";
import {RECAPTCHA_URL} from "../../utils/recaptcha.directive";
import {Task} from "../../task/task.model";
import {ActivatedRoute} from "@angular/router";
import {AlertService} from "../../utils/alert-service/alert.service";
import {TodoType} from "../../task/todo-type";
import * as moment from 'moment-mini-ts';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-front-page-respond',
  templateUrl: './front-page-respond.component.html',
  styleUrls: ['./front-page-respond.component.css'],
  providers: [{
    provide: RECAPTCHA_URL,
    useValue: environment.recaptchaVerifyUrl
  }]
})
export class FrontPageRespondComponent implements OnInit {

  isLoggedIn: boolean = false;
  securityFailed: boolean = false;

  taskType: string; // would prefer to use enum but they are garbage in TS/JS, so ...
  taskId: string;
  userId: string;
  token: string;

  task: Task;
  taskKey: string;
  todoKey: string;
  dateString: string;

  singleButton: boolean = false;
  succeeded: boolean = false;
  failed: boolean = false;

  public successParaKey: string;
  public meetingRespondedParaKey: string;

  public yesButtonKey: string;
  public noButtonKey: string;

  response: string;

  public recaptcha: FormControl;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private alertService: AlertService,
              private responseService: IncomingResponseService) {
    this.recaptcha = new FormControl();
  }

  ngOnInit() {
    this.isLoggedIn = this.userService.isLoggedIn();

    this.route.params.subscribe(params => {
      this.taskType = params['taskType'];
      this.userId = params['userId'];
      this.taskId = params['taskId'];
      this.token = params['token'];

      this.alertService.showLoading();
      this.taskKey = this.taskType.toLowerCase(); // for i18n
      this.fetchTask(this.taskType, this.userId, this.taskId, this.token);
    });
  }

  fetchTask(taskType: string, userId: string, taskId: string, token: string) {
    this.responseService.fetchTaskMinimumDetails(userId, taskType, taskId, token).subscribe(task => {
      console.log('okay, got what we need: here it is:', task);
      this.alertService.hideLoadingDelayed();

      this.task = task;
      this.dateString = moment(task.deadlineMillis).format('dddd, MMMM Do YYYY, h:mm a');
      this.singleButton = taskType == 'VOTE' || this.task.todoType == TodoType.INFORMATION_REQUIRED;

      if (taskType == 'TODO') {
        this.todoKey = task.todoType == TodoType.INFORMATION_REQUIRED ? 'information' :
          task.todoType == TodoType.VOLUNTEERS_NEEDED ? 'volunteer' : 'validate';
      }

      if (taskType == 'MEETING' && task.hasResponded) {
        this.meetingRespondedParaKey = task.userResponse.toLowerCase() === 'yes' ?
          'task.meeting.respond.already.body-yes' : 'task.meeting.respond.already.body-no';
      }
    }, error => {
      console.log(`error fetching task from server: ${error}`);
      this.alertService.hideLoading();
      if (error.status == 401)
        this.securityFailed = true;
    })
  }

  respondToTask(responseParam?: string) {
    console.log("responding to task with response: ", responseParam);
    const responseToSubmit = responseParam ? responseParam : this.response;
    console.log("submitting response: ", responseToSubmit);
    this.responseService.respondToTask(this.userId, this.taskType, this.taskId, this.token, responseToSubmit).subscribe(response => {
      console.log(`responded to task, : ${response}`);
      this.succeeded = true;
      this.failed = false;
      let responsePositive = this.taskType == 'MEETING' ? responseToSubmit == 'yes' :
        this.taskType == 'TODO' ? this.task.todoType == 'INFORMATION_REQUIRED' || responseToSubmit == 'yes' : true;
      console.log(`response positive: ${responsePositive}`);
      this.setSuccessParaKey(this.taskType, responsePositive);
    }, error => {
      console.log('error responding to task, result: ', error);
      this.succeeded = false;
      this.failed = true;
    })
  }

  setSuccessParaKey(taskType: string, positive: boolean) {
    if (taskType == 'MEETING') {
      this.successParaKey = positive ? 'task.meeting.respond.done-yes' : 'task.meeting.respond.done-no';
    } else if (taskType == 'TODO') {
      this.successParaKey = 'task.todo.respond.done-' + (positive ? 'positive' : 'negative') + '.' + this.todoKey;
    } else {
      this.successParaKey = 'task.vote.respond.done-yes';
    }
  }

}
