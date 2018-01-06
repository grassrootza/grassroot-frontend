import {Component, OnInit} from '@angular/core';
import {Group} from '../../model/group.model';
import {UserService} from '../../../user/user.service';
import {GroupService} from '../../group.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {TaskService} from '../../../task/task.service';
import {Task} from '../../../task/task.model';
import {TaskType} from '../../../task/task-type';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbDateTimeStruct} from '@zhaber/ng-bootstrap-datetimepicker';

declare var $: any;

@Component({
  selector: 'app-group-activity',
  templateUrl: './group-activity.component.html',
  styleUrls: ['./group-activity.component.css']
})
export class GroupActivityComponent implements OnInit {

  public groupUid: string = "";
  public upcomingTasks: Task[] = [];
  public taskTypes = TaskType;
  model: NgbDateTimeStruct;
  public yesNoVote: boolean = true;


  public createMeetingForm: FormGroup;
  public createVoteForm: FormGroup;


  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService,
              private taskService: TaskService,
              private formBuilder: FormBuilder) {

    this.initCreateMeetingForm();
    this.initCreateVoteForm()


  }

  initCreateMeetingForm(){
    this.createMeetingForm = this.formBuilder.group({
      'subject': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'location': ['', Validators.required],
      'dateTimeEpochMillis': [this.fromDate(new Date()), Validators.required],
      'parentType': 'GROUP',
      'publicMeeting': false,
    });
  }

  initCreateVoteForm(){
    this.createVoteForm = this.formBuilder.group({
      'title': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'description': '',
      'time': [this.fromDate(new Date()), Validators.required],
      'parentType': 'GROUP',
      voteOptions: this.formBuilder.array([
        this.initVoteOptions(),
      ])
    })
  }

  initVoteOptions() {
    return this.formBuilder.group({
      option: ['', Validators.required]
    });
  }
  addOption() {
    const control = < FormArray > this.createVoteForm.controls['voteOptions'];
    control.push(this.initVoteOptions());
  }
  removeOption(i: number) {
    const control = < FormArray > this.createVoteForm.controls['voteOptions'];
    control.removeAt(i);
  }

  fromDate(date): NgbDateTimeStruct {
    if (date) {
      return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate(), hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
    } else {
      return date;
    }
  }

  ngOnInit() {
    this.route.parent.params.subscribe((params: Params) => {
      this.groupUid = params['id'];
      this.loadTasks();
    });
  }

  loadTasks(){
    this.taskService.loadUpcomingGroupTasks(this.groupUid)
      .subscribe(
        tasks => {
          console.log(tasks);
          this.upcomingTasks = tasks;
        },
        error => {
          if(error.status = 401)
            this.userService.logout();
          console.log("Error loading tasks for group", error.status);
        }
      );
  }

  showCreateMeetingModal(){
    $('#create-meeting-modal').modal('show');
  }

  showCreateVoteModal(){
    $('#create-vote-modal').modal('show');
  }

  createMeeting(){
    $('#create-meeting-modal').modal("hide");
    if (this.createMeetingForm.valid) {
      let parentType: string = this.createMeetingForm.get("parentType").value;
      let meetingSubject: string = this.createMeetingForm.get("subject").value;
      let meetingLocation: string = this.createMeetingForm.get("location").value;
      let meetingDateTime:NgbDateTimeStruct = this.createMeetingForm.get("dateTimeEpochMillis").value;
      let dateTimeEpochMillis: number = new Date(meetingDateTime.year,
                                                  meetingDateTime.month-1,
                                                  meetingDateTime.day,
                                                  meetingDateTime.hour,
                                                  meetingDateTime.minute,
                                                  meetingDateTime.second).getTime();
      let publicMeeting: boolean = this.createMeetingForm.get("publicMeeting").value;

      this.taskService.createMeeting(parentType, this.groupUid, meetingSubject, meetingLocation, dateTimeEpochMillis, publicMeeting)
        .subscribe(task => {
          console.log("Meeting successfully created, groupUid: " + this.groupUid + ", taskuid:" + task.taskUid);
          this.initCreateMeetingForm();
          this.loadTasks();
        },
          error => {
            console.log("Error creating task: ", error);
          });
    }
    else {
      console.log("Create meeting form invalid!");
    }
  }

  voteTypeChanged(voteType) {
    this.yesNoVote = voteType === 'YES_NO';
  }

  createVote(){
    $('#create-vote-modal').modal("hide");
    if(this.createVoteForm.valid){
      console.log("vote create");
      let parentType: string = this.createVoteForm.get("parentType").value;
      let title: string = this.createVoteForm.get("title").value;
      // let voteOptions: string[] = this.createVoteForm.get("voteOptions").value;
      let voteOptions: string[] = [];
      let description: string = this.createVoteForm.get("description").value;
      let voteTime:NgbDateTimeStruct = this.createVoteForm.get("time").value;
      let voteMilis: number = new Date(voteTime.year,
        voteTime.month-1,
        voteTime.day,
        voteTime.hour,
        voteTime.minute,
        voteTime.second).getTime();

      this.taskService.createVote(parentType, this.groupUid, title, voteOptions, description, voteMilis)
        .subscribe(task => {
          console.log("Vote successfully created, groupUid: " + this.groupUid + ", taskUid: " + task.taskUid);
          this.initCreateVoteForm();
          this.loadTasks();
        },
          error => {
            console.log("Error creating task: ", error);
          })
    }else{
      console.log("Create vote form invalid!");
    }
  }


}
