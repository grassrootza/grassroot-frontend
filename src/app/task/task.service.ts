import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {AuthHttp} from "angular2-jwt";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {Task} from "./task.model";

@Injectable()
export class TaskService {

  private upcomingGroupTasksUrl = environment.backendAppUrl + "/api/task/fetch/upcoming/group";

  constructor(private authHttp: AuthHttp) {
  }


  public loadUpcomingGroupTasks(groupId: string): Observable<Task[]> {
    let fullUrl = this.upcomingGroupTasksUrl + "/" + groupId;
    return this.authHttp.get(fullUrl)
      .map(resp => resp.json())
      .map(json => {
        return json.map(taskJson => Task.fromJson(taskJson));
      })
  }
}
