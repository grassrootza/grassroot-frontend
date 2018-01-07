import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {Task} from "./task.model";
import {HttpClient, HttpParams} from '@angular/common/http';
import {TaskType} from "./task-type";
import {GroupRef} from '../groups/model/group-ref.model';

@Injectable()
export class TaskService {

  private upcomingGroupTasksUrl = environment.backendAppUrl + "/api/task/fetch/upcoming/group";
  private upcomingUserTasksUrl = environment.backendAppUrl + "/api/task/fetch/upcoming/user";

  private groupCreateMeetingUrl = environment.backendAppUrl + '/api/task/create/meeting';
  private groupCreateVoteUrl = environment.backendAppUrl + '/api/task/create/vote';


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
            task.ancestorGroupName
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
            task.ancestorGroupName
            )
          )
      );
  }


  createMeeting(parentType: string, parentUid: string, subject: string, location: string, dateTimeEpochMillis: number, publicMeeting: boolean):Observable<Task> {
    const fullUrl = this.groupCreateMeetingUrl + '/' + parentType + '/' + parentUid;

    let params = new HttpParams()
      .set('subject', subject)
      .set('location', location)
      .set('dateTimeEpochMillis', dateTimeEpochMillis.toString())
      .set('publicMeeting', publicMeeting.toString());

    return this.httpClient.post<Task>(fullUrl, null, {params: params});
  }

  createVote(parentType: string, parentUid: string, title: string, voteOptions: string[], description: string, time: number):Observable<Task>{
    const fullUrl = this.groupCreateVoteUrl + '/' + parentType + '/' + parentUid;

    let params = new HttpParams()
      .set('title', title)
      .set('voteOptions', voteOptions.join(","))
      .set('description', description)
      .set('time', time.toString());


    return this.httpClient.post<Task>(fullUrl, null, {params: params});
  }
}
