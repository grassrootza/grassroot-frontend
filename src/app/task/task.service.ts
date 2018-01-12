import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {Task} from "./task.model";
import {HttpClient, HttpParams} from '@angular/common/http';
import {TaskType} from "./task-type";
import {TodoType} from "./todo-type";

@Injectable()
export class TaskService {

  private upcomingGroupTasksUrl = environment.backendAppUrl + "/api/task/fetch/upcoming/group";
  private upcomingUserTasksUrl = environment.backendAppUrl + "/api/task/fetch/upcoming/user";

  private groupCreateMeetingUrl = environment.backendAppUrl + '/api/task/create/meeting';
  private groupCreateVoteUrl = environment.backendAppUrl + '/api/task/create/vote';
  private groupCreateTodoUrl = environment.backendAppUrl + '/api/task/create/todo';

  private groupRespondeTodoUrl = environment.backendAppUrl + '/api/task/respond/todo/information';


  constructor(private httpClient: HttpClient) {
  }

  public loadUpcomingGroupTasks(groupId: string): Observable<Task[]> {
    let fullUrl = this.upcomingGroupTasksUrl + "/" + groupId;
    return this.httpClient.get<Task[]>(fullUrl)
      .map(
        data =>
          data.map(task => new Task(
            task.taskUid,
            task.title,
            TaskType[task.type],
            task.deadlineMillis,
            new Date(task.deadlineMillis),
            task.description,
            task.location,
            task.parentUid,
            task.parentName,
            task.ancestorGroupName,
            task.todoType != null ? TodoType[task.todoType] : null,
            task.hasResponded
            )
          )
      );
  }


  public loadUpcomingUserTasks(userId: string): Observable<Task[]> {
    let fullUrl = this.upcomingUserTasksUrl + "/" + userId;
    return this.httpClient.get<Task[]>(fullUrl)
      .map(
        data =>
          data.map(task => new Task(
            task.taskUid,
            task.title,
            TaskType[task.type],
            task.deadlineMillis,
            new Date(task.deadlineMillis),
            task.description,
            task.location,
            task.parentUid,
            task.parentName,
            task.ancestorGroupName,
            task.todoType != null ? TodoType[task.todoType] : null,
            task.hasResponded
            )
          )
      );
  }


  createMeeting(parentType: string, parentUid: string, subject: string, location: string, dateTimeEpochMillis: number, publicMeeting: boolean, assignedMemberUids: string[]):Observable<Task> {
    const fullUrl = this.groupCreateMeetingUrl + '/' + parentType + '/' + parentUid;

    let params = new HttpParams()
      .set('subject', subject)
      .set('location', location)
      .set('dateTimeEpochMillis', dateTimeEpochMillis.toString())
      .set('publicMeeting', publicMeeting.toString())
      .set('assignedMemberUids', assignedMemberUids.join(','));

    return this.httpClient.post<Task>(fullUrl, null, {params: params});
  }

  createVote(parentType: string, parentUid: string, title: string, voteOptions: string[], description: string, time: number, assignedMemberUids: string[]):Observable<Task>{
    const fullUrl = this.groupCreateVoteUrl + '/' + parentType + '/' + parentUid;

    let params = new HttpParams()
      .set('title', title)
      .set('voteOptions', voteOptions.join(","))
      .set('description', description)
      .set('time', time.toString())
      .set('assignedMemberUids', assignedMemberUids.join(','));


    return this.httpClient.post<Task>(fullUrl, null, {params: params});
  }

  createTodo(todoType: string, parentType: string, parentUid: string, subject: string, dueDateTime: number, responseTag: string,
             requireImages: boolean, recurring:boolean, recurringPeriodMillis: number, assignedMemberUids: string[], confirmingMemberUids: string[]):Observable<Task> {
    let fullUrl = this.groupCreateTodoUrl;
    let params;

    if(todoType === "INFORMATION_REQUIRED"){
      fullUrl = fullUrl +  '/information/' + parentType + '/' + parentUid;
      params = new HttpParams()
        .set("subject", subject)
        .set("dueDateTime", dueDateTime.toString())
        .set("responseTag", responseTag)
        .set("assignedUids", assignedMemberUids.join(","));
    }

    if(todoType === "VALIDATION_REQUIRED"){
      fullUrl = fullUrl + '/confirmation/' + parentType + '/' + parentUid;
      params = new HttpParams()
        .set("subject", subject)
        .set("dueDateTime", dueDateTime.toString())
        .set("requireImages", requireImages.toString())
        .set("recurring", recurring.toString())
        .set("assignedMemberUids", assignedMemberUids.join(","))
        .set("confirmingMemberUids", confirmingMemberUids.join(","))
        .set("recurringPeriodMillis", recurringPeriodMillis.toString());
    }

    if(todoType === "ACTION_REQUIRED"){
      fullUrl = fullUrl + '/action/' + parentType + '/' + parentUid;
      params = new HttpParams()
        .set("subject", subject)
        .set("dueDateTime", dueDateTime.toString())
        .set("recurring", recurring.toString())
        .set("assignedMemberUids", assignedMemberUids.join(","))
        .set("recurringPeriodMillis", recurringPeriodMillis.toString());
    }

    if(todoType === "VOLUNTEERS_NEEDED"){
      fullUrl = fullUrl + '/volunteer/' + parentType + '/' + parentUid;
      params = new HttpParams()
        .set("subject", subject)
        .set("dueDateTime", dueDateTime.toString())
        .set("assignedMemberUids", assignedMemberUids.join(","));
    }


    return this.httpClient.post<Task>(fullUrl, null, {params: params});
  }


  respondToDo(todoUid: string, userUid: string, response: string) {
    let url = this.groupRespondeTodoUrl + "/" + todoUid + "/" + userUid;
    let params = new HttpParams()
      .set("response", response);

    this.httpClient.get(url, {params: params})
      .subscribe(
        resp => console.log("Complete action response")
      );


  }
}
