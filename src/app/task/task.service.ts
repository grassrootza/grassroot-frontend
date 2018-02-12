import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/map";
import {Task} from "./task.model";
import {HttpClient, HttpParams} from '@angular/common/http';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {LiveWireAlertType} from "../livewire/live-wire-alert-type.enum";
import {LiveWireAlertDestType} from "../livewire/live-wire-alert-dest-type.enum";
import {MediaFunction} from "../media/media-function.enum";

@Injectable()
export class TaskService {

  private upcomingGroupTasksUrl = environment.backendAppUrl + "/api/task/fetch/upcoming/group";
  private upcomingUserTasksUrl = environment.backendAppUrl + "/api/task/fetch/upcoming/user";

  private groupCreateMeetingUrl = environment.backendAppUrl + '/api/task/create/meeting';
  private groupCreateVoteUrl = environment.backendAppUrl + '/api/task/create/vote';
  private groupCreateTodoUrl = environment.backendAppUrl + '/api/task/create/todo';

  private groupRespondeTodoUrl = environment.backendAppUrl + '/api/task/respond/todo/information';

  private allGroupTasksUrl = environment.backendAppUrl + "/api/task/fetch/group";

  private createLiveWireAlertUrl = environment.backendAppUrl + "/api/livewire/create";
  private uploadImageUrl = environment.backendAppUrl + "/api/media/storeImage";

  private upcomingTasksSubject: BehaviorSubject<Task[]> = new BehaviorSubject(null);
  public upcomingTasks: Observable<Task[]> = this.upcomingTasksSubject.asObservable();
  private upcomingTasksErrorSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public upcomingTaskError: Observable<any> = this.upcomingTasksErrorSubject.asObservable();
  private MY_AGENDA_DATA_CACHE = "MY_AGENDA_DATA_CACHE";


  constructor(private httpClient: HttpClient) {

    let cachedTasks = localStorage.getItem(this.MY_AGENDA_DATA_CACHE);
    if (cachedTasks) {
      let cachedTasksData = JSON.parse(localStorage.getItem(this.MY_AGENDA_DATA_CACHE));
      console.log("Cached tasks before", cachedTasksData);
      cachedTasksData = cachedTasksData.map(task => Task.createInstanceFromData(task));
      console.log("Cached tasks before", cachedTasksData);
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
      }
      );
   }


  public loadUpcomingUserTasks(userId: string) {

    let fullUrl = this.upcomingUserTasksUrl + "/" + userId;
    this.httpClient.get<Task[]>(fullUrl)
      .map(data => data.map(task => Task.createInstanceFromData(task)))
      .subscribe(
        tasks => {
          this.upcomingTasksSubject.next(tasks);
          localStorage.setItem(this.MY_AGENDA_DATA_CACHE, JSON.stringify(tasks));
        },
        error => {
          this.upcomingTasksErrorSubject.next(error);
          console.log("Failed to fetch upcoming tasks!", error);
        }
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


  respondToDo(todoUid: string, userUid: string, response: string): Observable<string> {
    let url = this.groupRespondeTodoUrl + "/" + todoUid + "/" + userUid;
    let params = new HttpParams()
      .set("response", response);

    return this.httpClient.get<string>(url, {params: params})

  }

  uploadAlertImage(image):Observable<any>{
    let uploadFullUrl = this.uploadImageUrl + "/" + MediaFunction.LIVEWIRE_MEDIA;
    return this.httpClient.post(uploadFullUrl, image,{ responseType: 'text' });
  }

  createLiveWireAlert(userUid:string,headline:string,alertType:LiveWireAlertType,groupUid:string,taskUid:string,
                      destination:LiveWireAlertDestType,description:string,addLocation:boolean,contactPerson:string,
                      contactPersonName:string,contactPersonNumber:string,mediaKeys:Set<string>):Observable<any>{

    let fullUrl = this.createLiveWireAlertUrl + "/" + userUid;
    let params;

    params = new HttpParams()
      .set("headline",headline)
      .set("description",description)
      .set("type",alertType)
      .set("groupUid",groupUid)
      .set("addLocation",addLocation + "")
      .set("destType",destination)
      .set("taskUid",taskUid)
      .set("mediaFileKeys",mediaKeys + "");

      if(contactPerson === "someone"){
      params = new HttpParams()
        .set("headline",headline)
        .set("description",description)
        .set("type",alertType)
        .set("groupUid",groupUid)
        .set("addLocation",addLocation + "")
        .set("destType",destination)
        .set("taskUid",taskUid)
        .set("contactNumber",contactPersonNumber)
        .set("contactName",contactPersonName)
        .set("mediaFileKeys",mediaKeys + "");;
      }



   if(alertType === "MEETING"){
      console.log("Is a meeting man...........................");
    }

    return this.httpClient.post(fullUrl,null,{params:params});
  }



}
