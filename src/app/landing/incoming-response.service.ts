import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class IncomingResponseService {

  constructor(private httpClient: HttpClient) {

  }

  unsubscribeFromGroup(userUid: string, groupUid: string, token: string) {

  }

  respondToMeeting(userUid: string, meetingUid: string, token: string) {

  }

  respondToTodo(userUid: string, todoUid: string, token: string) {

  }

}
