import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TaskService} from '../../../../task/task.service';
import {GroupService} from '../../../group.service';
import {NgbDateStruct, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
import {Membership} from '../../../model/membership.model';

const TodoTypes: any[] =
  [
    { "value": "INFORMATION_REQUIRED", "name": "Respond with information" },
    { "value": "VALIDATION_REQUIRED", "name": "Validate action" },
    { "value": "ACTION_REQUIRED", "name": "Take action" },
    { "value": "VOLUNTEERS_NEEDED", "name": "Volunteer"}
  ];

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.css']
})
export class CreateTodoComponent implements OnInit {

  public todoTypes = TodoTypes;
  public createTodoForm: FormGroup;
  // private membersPage: MembersPage = new MembersPage(0, 0, 0, 0, true, false, []);
  public assignedMemberUids: Membership[] = [];
  public filteredAssignedMemberUids: Membership[] = [];
  public confirmingMemberUids: Membership[] = [];
  public filteredConfirmingMemberUids: Membership[] = [];
  @Input() groupUid: string;
  @Output() todoSaved: EventEmitter<boolean>;



  constructor(private taskService: TaskService,
              private groupService: GroupService,
              private formBuilder: FormBuilder) {
    this.initCreateTodoForm();
    this.todoSaved = new EventEmitter<boolean>();
  }

  ngOnInit() {
    this.initCreateTodoForm();
  }

  fetchGroupMembers(){
    if(this.groupUid != "" && this.groupUid != undefined) {
      this.groupService.fetchGroupMembers(this.groupUid, 0, 100000).subscribe(members =>{
        this.assignedMemberUids = members.content;
        this.confirmingMemberUids = members.content;
        this.filteredAssignedMemberUids = this.assignedMemberUids;
        this.filteredConfirmingMemberUids = this.confirmingMemberUids;
      });
    }


  }

  initCreateTodoForm(){

    this.createTodoForm = this.formBuilder.group({
      'todoType': TodoTypes[0].value,
      'subject': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'date': [this.dateFromDate(new Date()), Validators.required],
      'time': [this.timeFromDate(new Date()), Validators.required],
      'parentType': 'GROUP'
    });

    let selectedTodoType = this.createTodoForm.controls['todoType'].value;

    if(selectedTodoType === TodoTypes[0].value){
      this.initInformationRequiredTodo();
    }else if(selectedTodoType === TodoTypes[1].value){
      this.initValidationRequiredTodo();
    }else if(selectedTodoType === TodoTypes[2].value){
      this.initActionRequiredTodo();
    }else if(selectedTodoType === TodoTypes[3].value){
      this.initVolunteersNeededTodo();
    }

    this.fetchGroupMembers();
  }

  initInformationRequiredTodo(){
    this.createTodoForm.addControl('responseTag', new FormControl('', Validators.required));
    this.createTodoForm.addControl('assignedMemberUids', new FormControl([]));
    console.log("initInformationRequiredTodo");
  }

  initValidationRequiredTodo(){
    this.createTodoForm.addControl("requireImages",new FormControl(false));
    this.createTodoForm.addControl("assignedMemberUids", new FormControl([], Validators.required));
    this.createTodoForm.addControl("confirmingMemberUids", new FormControl([], Validators.required));
    this.createTodoForm.addControl("recurring", new FormControl(false));
    this.createTodoForm.addControl("recurringPeriodMillis", new FormControl(0));
    console.log("initValidationRequiredTodo");
  }

  initActionRequiredTodo(){
    this.createTodoForm.addControl("recurring", new FormControl(false));
    this.createTodoForm.addControl("recurringPeriodMillis", new FormControl(0));
    this.createTodoForm.addControl("assignedMemberUids", new FormControl([]));

    console.log("initActionRequiredTodo");
  }

  initVolunteersNeededTodo(){
    console.log("initVolunteersNeededTodo");
    this.createTodoForm.addControl("assignedMemberUids", new FormControl([]));

  }

  dateFromDate(date): NgbDateStruct{
    if(date){
      return {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()};
    }else{
      return date;
    }
  }

  timeFromDate(date): NgbTimeStruct{
    if(date){
      return {hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds()};
    }else{
      return date;
    }
  }

  todoTypeChanged(todoType){
    //on todoType changed clear all additional controls and then add ones according to type.
    this.removeAllAdditionalControls();

    if(todoType === TodoTypes[0].value){
      this.initInformationRequiredTodo();
    }else if(todoType === TodoTypes[1].value){
      this.initValidationRequiredTodo();
    }else if(todoType === TodoTypes[2].value){
      this.initActionRequiredTodo();
    }else if(todoType === TodoTypes[3].value){
      this.initVolunteersNeededTodo();
    }

    this.fetchGroupMembers();
  }
  removeAllAdditionalControls(){
    this.createTodoForm.removeControl("responseTag");
    this.createTodoForm.removeControl("requireImages");
    this.createTodoForm.removeControl("assignedMemberUids");
    this.createTodoForm.removeControl("confirmingMemberUids");
    this.createTodoForm.removeControl("recurring");
    this.createTodoForm.removeControl("recurringPeriodMillis");
  }

  assignedMemberUidsPicked(){
    let memberUids: string[] = this.createTodoForm.controls['assignedMemberUids'].value;
    if(memberUids.length == 0){
      this.filteredConfirmingMemberUids = this.confirmingMemberUids;
    }else{
      this.filteredConfirmingMemberUids = this.confirmingMemberUids;
      memberUids.forEach(uids => {
        this.filteredConfirmingMemberUids = this.filteredConfirmingMemberUids.filter(member => member.user.uid != uids);
      });
    }
  }

  confirmingMemberUidsPicked(){
    let memberUids: string[] = this.createTodoForm.controls['confirmingMemberUids'].value;
    if(memberUids.length == 0){
      this.filteredAssignedMemberUids = this.assignedMemberUids;
    }else{
      this.filteredAssignedMemberUids = this.assignedMemberUids;
      memberUids.forEach(uids => {
        this.filteredAssignedMemberUids = this.filteredAssignedMemberUids.filter(member => member.user.uid != uids);
      });
    }
  }

  createTodo(){
    if(this.createTodoForm.valid){
      let todoType: string = this.createTodoForm.get("todoType").value;
      let parentType: string = this.createTodoForm.get("parentType").value;
      let subject: string = this.createTodoForm.get("subject").value;


      let responseTag: string = "";
      if(this.createTodoForm.get("responseTag") != null){
        responseTag = this.createTodoForm.get("responseTag").value;
      }

      let voteDate: NgbDateStruct = this.createTodoForm.get('date').value;
      let voteTime: NgbTimeStruct = this.createTodoForm.get('time').value;
      let dueTimemilis: number = new Date(voteDate.year,
        voteDate.month-1,
        voteDate.day,
        voteTime.hour,
        voteTime.minute,
        voteTime.second).getTime();


      let assignedMemberUids: string[] = [];
      if(this.createTodoForm.get("assignedMemberUids") != null){
        for(let i=0; i < this.createTodoForm.get("assignedMemberUids").value.length; i++ ){
          assignedMemberUids.push(this.createTodoForm.get("assignedMemberUids").value[i]);
        }
      }

      let confirmingMemberUids: string[] = [];
      if(this.createTodoForm.get("confirmingMemberUids") != null){
        for(let i=0; i < this.createTodoForm.get("confirmingMemberUids").value.length; i++ ){
          confirmingMemberUids.push(this.createTodoForm.get("confirmingMemberUids").value[i]);
        }
      }

      let requireImages: boolean = false;
      if(this.createTodoForm.get("requireImages") != null){
        requireImages = this.createTodoForm.get("requireImages").value;
      }

      let recurring: boolean = false;
      if(this.createTodoForm.get("recurring") != null){
        recurring = this.createTodoForm.get("recurring").value;
      }

      let recurringInterval: number = 0;
      if(this.createTodoForm.get("recurringPeriodMillis") != null){
        recurringInterval = this.createTodoForm.get("recurringPeriodMillis").value*60000;
      }

      this.taskService.createTodo(todoType, parentType, this.groupUid, subject, dueTimemilis, responseTag, requireImages,
        recurring, recurringInterval, assignedMemberUids, confirmingMemberUids)
        .subscribe(task => {
          console.log("Todo successfully created, groupUid: " + this.groupUid + ", taskUid: " + task.taskUid);
          this.initCreateTodoForm();
          this.todoSaved.emit(true);
        },
          error => {
            console.log("Error creating task: ", error);
            this.todoSaved.emit(false);
          })
    }else{
      console.log("Create todo form invalid!");
    }
  }


}
