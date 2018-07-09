import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {environment} from "environments/environment";
import {Task} from "../task/task.model";

@Injectable()
export class IncomingResponseService {

  private unsubscribeBaseUrl = environment.backendAppUrl + "/api/inbound/unsubscribe";
  private fetchGroupNameUrl = environment.backendAppUrl + "/api/inbound/unsubscribe/name";

  private fetchTaskMinDetailsUrl = environment.backendAppUrl + "/api/inbound/respond/fetch";
  private respondToTaskUrl = environment.backendAppUrl + "/api/inbound/respond/submit";

  constructor(private httpClient: HttpClient) { }

  unsubscribeFromGroup(userUid: string, groupUid: string, token: string): Observable<any> {
    const fullUrl = this.unsubscribeBaseUrl + "/" + groupUid + "/" + userUid + "/" + token;
    return this.httpClient.get(fullUrl);
  }

  fetchGroupName(userUid: string, groupUid: string, token: string): Observable<any> {
    const fullUrl = this.fetchGroupNameUrl + "/" + groupUid + "/" + userUid + "/" + token;
    return this.httpClient.get(fullUrl, { responseType: 'text'});
  }

  fetchTaskMinimumDetails(userId: string, taskType: string, taskId: string, token: string): Observable<Task> {
    const fullUrl = this.fetchTaskMinDetailsUrl + "/" + taskType + "/" + taskId + "/" + userId + "/" + token;
    return this.httpClient.get<Task>(fullUrl).map(Task.createInstanceFromData);
  }

  respondToTask(userId: string, taskType: string, taskId: string, token: string, response: string): Observable<string> {
    const fullUrl = this.respondToTaskUrl + "/" + taskType + "/" + taskId + "/" + userId + "/" + token;
    let params = new HttpParams().set("response", response);
    console.log(`okay, calling http client, params: ${response}`);
    return this.httpClient.get(fullUrl, { params: params, responseType: 'text'});
  }

}
