import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {Task} from "./task.model";
import {TaskType} from "./task-type";
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {MediaFunction} from "../media/media-function.enum";
import {LocalStorageService} from "../utils/local-storage.service";

@Injectable()
export class TaskService {

  private upcomingGroupTasksUrl = environment.backendAppUrl + "/api/task/fetch/upcoming/group";
  private upcomingUserTasksUrl = environment.backendAppUrl + "/api/task/fetch/upcoming/user";
  private specificTasksUrl = environment.backendAppUrl + "/api/task/fetch";

  private groupCreateMeetingUrl = environment.backendAppUrl + '/api/task/create/meeting';
  private groupCreateVoteUrl = environment.backendAppUrl + '/api/task/create/vote';
  private groupCreateTodoUrl = environment.backendAppUrl + '/api/task/create/todo';

  private groupRespondeTodoUrl = environment.backendAppUrl + '/api/task/respond/todo/information';

  private allGroupTasksUrl = environment.backendAppUrl + "/api/task/fetch/group";

  private uploadImageUrl = environment.backendAppUrl + "/api/media/store/body";

  private castVoteUrl = environment.backendAppUrl + "/api/task/respond/vote";

  private meetingResponsesUrl = environment.backendAppUrl + "/api/task/fetch/meeting/rsvps";
  private meetingRsvpUrl = environment.backendAppUrl + "/api/task/respond/meeting";

  private todoResponsesUrl = environment.backendAppUrl + "/api/task/fetch/todo/responses";
  private todoResponsesDownload = environment.backendAppUrl + "/api/task/fetch/todo/download";

  private fetchImageKeyUrl = environment.backendAppUrl + "/api/task/fetch/image";

  private upcomingTasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject(null);
  public upcomingTasks: Observable<Task[]> = this.upcomingTasksSubject.asObservable();
  private upcomingTasksErrorSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public upcomingTaskError: Observable<any> = this.upcomingTasksErrorSubject.asObservable();

  private cancelTaskUrl = environment.backendAppUrl + "/api/task/modify/cancel";

  private downloadErrorReportUrl = environment.backendAppUrl + "/api/task/fetch/error-report";

  private MY_AGENDA_DATA_CACHE = "MY_AGENDA_DATA_CACHE";

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {

    let cachedTasks = this.localStorageService.getItem(this.MY_AGENDA_DATA_CACHE);
    if (cachedTasks) {
      let cachedTasksData = JSON.parse(this.localStorageService.getItem(this.MY_AGENDA_DATA_CACHE));
      // console.log("Cached tasks before", cachedTasksData);
      cachedTasksData = cachedTasksData.map(task => Task.createInstanceFromData(task));
      // console.log("Cached tasks before", cachedTasksData);
      this.upcomingTasksSubject.next(cachedTasksData);
    }
  }


  public loadUpcomingGroupTasks(groupId: string): Observable<Task[]> {
    let fullUrl = this.upcomingGroupTasksUrl + "/" + groupId;
    return this.httpClient.get<Task[]>(fullUrl)
      .map(data => data.map(task => Task.createInstanceFromData(task)));
  }

  public loadAllGroupTasks(userUid:string,groupUid:string): Observable<Task[]>{
    let url = this.allGroupTasksUrl + "/" + userUid + "/" + groupUid;
    return this.httpClient.get(url).map(
      res => {
          console.log("results: ", res);
        let tasks = res["addedAndUpdated"]  as Task[];
        return tasks.map(t => Task.createInstanceFromData(t))
      });
  }

  public loadUpcomingUserTasks() {
    this.httpClient.get<Task[]>(this.upcomingUserTasksUrl)
      .map(data => data.map(task => Task.createInstanceFromData(task)))
      .subscribe(
        tasks => {
          this.upcomingTasksSubject.next(tasks);
          this.localStorageService.setItem(this.MY_AGENDA_DATA_CACHE, JSON.stringify(tasks));
        },
        error => {
          this.upcomingTasksErrorSubject.next(error);
          console.log("Failed to fetch upcoming tasks!", error);
        }
      );
  }

  public loadTask(taskUid: string, taskType: string): Observable<Task> {
    const fullUrl = this.specificTasksUrl + "/" + taskType + "/" + taskUid;
    return this.httpClient.get<Task>(fullUrl).map(Task.createInstanceFromData);
  }

  createMeeting(parentType: string, parentUid: string, subject: string, location: string,
                dateTimeEpochMillis: number, publicMeeting: boolean, description: string,
                imageKey: string, assignedMemberUids: string[]):Observable<Task> {
    const fullUrl = this.groupCreateMeetingUrl + '/' + parentType + '/' + parentUid;

    let params = new HttpParams()
      .set('subject', subject)
      .set('location', location)
      .set('dateTimeEpochMillis', dateTimeEpochMillis.toString())
      .set('publicMeeting', publicMeeting.toString())
      .set('assignedMemberUids', assignedMemberUids.join(','));

    if (description)
      params = params.set("description", description);

    if (imageKey)
      params = params.set("mediaFileUid", imageKey);

    return this.httpClient.post<Task>(fullUrl, null, {params: params});
  }

  createVote(parentType: string, parentUid: string, title: string, voteOptions: string[], description: string, time: number, imageKey: string, assignedMemberUids: string[]):Observable<Task>{
    const fullUrl = this.groupCreateVoteUrl + '/' + parentType + '/' + parentUid;

    let params = new HttpParams()
      .set('title', title)
      .set('voteOptions', voteOptions.join(","))
      .set('description', description)
      .set('time', time.toString())
      .set('assignedMemberUids', assignedMemberUids.join(','));

    if (imageKey) {
      params = params.set("mediaFileUid", imageKey);
    }

    return this.httpClient.post<Task>(fullUrl, null, {params: params});
  }

  createTodo(todoType: string, parentType: string, parentUid: string, subject: string, dueDateTime: number, responseTag: string,
             requireImages: boolean, recurring:boolean, recurringPeriodMillis: number, imageKey: string, assignedMemberUids: string[], confirmingMemberUids: string[]):Observable<Task> {
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

    if (imageKey) {
      params = params.set("mediaFileUids", imageKey);
    }

    console.log("creating todo with params: ", params);
    return this.httpClient.post<Task>(fullUrl, null, {params: params});
  }


  respondToDo(todoUid: string, response: string): Observable<string> {
    let url = this.groupRespondeTodoUrl + "/" + todoUid;
    let params = new HttpParams()
      .set("response", response);

    return this.httpClient.get<string>(url, {params: params})
  }

  uploadAlertImage(image):Observable<any>{
    let uploadFullUrl = this.uploadImageUrl + "/" + MediaFunction.LIVEWIRE_MEDIA;
    return this.httpClient.post(uploadFullUrl, image,{ responseType: 'json' });
  }

  castVote(taskUid:string, response:string):Observable<Task>{
    let fullUrl = this.castVoteUrl + "/" + taskUid;
    let params = new HttpParams().set("vote", response);
    return this.httpClient.post<Task>(fullUrl, null, {params:params}).map(Task.createInstanceFromData);
  }

  fetchMeetingResponses(taskUid: string): Observable<Map<string, string>> {
    const fullUrl = this.meetingResponsesUrl + "/" + taskUid;
    return this.httpClient.get<Map<string, string>>(fullUrl);
  }

  respondToMeeting(taskUid: string, response: string): Observable<Map<string, string>> {
    const fullUrl = this.meetingRsvpUrl + "/" + taskUid;
    let params = new HttpParams().set("response", response.toUpperCase());
    return this.httpClient.post<Map<string, string>>(fullUrl, null, {params: params});
  }

  fetchTodoResponses(taskUid: string): Observable<Map<string, string>> {
    const fullUrl = this.todoResponsesUrl + "/" + taskUid;
    return this.httpClient.get<Map<string, string>>(fullUrl);
  }

  downloadTodoResponses(taskUid: string): Observable<any> {
    const fullUrl = this.todoResponsesDownload + "/" + taskUid;
    return this.httpClient.get(fullUrl, { responseType: 'blob'});
  }

  fetchImageKey(taskUid: string, taskType: TaskType): Observable<string> {
    const fullUrl = this.fetchImageKeyUrl + "/" + taskType + "/" + taskUid;
    return this.httpClient.get(fullUrl, { responseType: 'text' });
  }

  cancelTask(taskUid: string, taskType: TaskType, notifyMembers: boolean = true, reloadAgenda: boolean = true) {
    const fullUrl = this.cancelTaskUrl + "/" + taskType + "/" + taskUid;
    console.log("send notification param: ", notifyMembers.toString());
    let params = new HttpParams().set("sendNotifications", notifyMembers.toString());
    return this.httpClient.post(fullUrl, null, {params: params}).map(response => {
      if (reloadAgenda) {
        this.loadUpcomingUserTasks();
      }
    });
  }

  downloadBroadcastErrorReport(taskType: string, taskUid: string) {
    const fullUrl = this.downloadErrorReportUrl + '/' + taskType + '/' + taskUid + '/download';

    return this.httpClient.get(fullUrl, { responseType: 'blob' });
  }


}
