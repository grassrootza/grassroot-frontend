import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {Task} from "./task.model";
import {HttpClient} from "@angular/common/http";
import {TaskType} from "./task-type";

@Injectable()
export class TaskService {

  private upcomingGroupTasksUrl = environment.backendAppUrl + "/api/task/fetch/upcoming/group";

  constructor(private httpClient: HttpClient) {
  }

  public loadUpcomingGroupTasks(groupId: string): Observable<Task[]> {
    let fullUrl = this.upcomingGroupTasksUrl + "/" + groupId;
    return this.httpClient.get<Task[]>(fullUrl)
      .map(
        data =>
          data.map(task => new Task(task.taskUid, task.title, TaskType[task.type], task.deadlineMillis, new Date(task.deadlineMillis), task.description, task.location))
      );
  }
}
