import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {environment} from "../../environments/environment";

@Injectable()
export class IncomingResponseService {

  private unsubscribeBaseUrl = environment.backendAppUrl + "/api/inbound/unsubscribe";
  private fetchGroupNameUrl = environment.backendAppUrl + "/api/inbound/unsubscribe/name";

  constructor(private httpClient: HttpClient) { }

  unsubscribeFromGroup(userUid: string, groupUid: string, token: string): Observable<any> {
    const fullUrl = this.unsubscribeBaseUrl + "/" + groupUid + "/" + userUid + "/" + token;
    return this.httpClient.get(fullUrl);
  }

  fetchGroupName(userUid: string, groupUid: string, token: string): Observable<any> {
    const fullUrl = this.fetchGroupNameUrl + "/" + groupUid + "/" + userUid + "/" + token;
    return this.httpClient.get(fullUrl, { responseType: 'text'});
  }

  // respondToMeeting(userUid: string, meetingUid: string, token: string): Observable<any> {
  //
  // }
  //
  // respondToTodo(userUid: string, todoUid: string, token: string): Observable<any> {
  //
  // }

}
