import {Component, Input, OnInit} from '@angular/core';
import {Task} from "../../task/task.model";
import {UserService} from "../../user/user.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TaskService} from "../../task/task.service";

declare var $: any;

@Component({
  selector: 'app-view-vote',
  templateUrl: './view-vote.component.html',
  styleUrls: ['./view-vote.component.css']
})
export class ViewVoteComponent implements OnInit {

  @Input()
  public taskToView:Task;

  @Input()
  public voteResponse:string;

  public castVoteForm :FormGroup;
  public response:string = "";

  constructor(private userService:UserService,
              private formBuilder: FormBuilder,
              private taskService:TaskService) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.castVoteForm = this.formBuilder.group({
      response : new FormControl()
    });
  }

  selectResponse(response) {
    console.log("RESPONSE...........",response);
    this.response = response;
  }

  castVote(){
    console.log("ID.....",this.taskToView.taskUid);
    let phoneNumber = this.userService.getLoggedInUser().msisdn;
    let code = "+27";

    this.taskService.castVote(this.taskToView.taskUid,phoneNumber,this.response).subscribe(resp =>{
      console.log("Resp....",resp);
      $("#view-vote-modal").modal("hide");
      console.log("Task......",this.taskToView);
    },error =>{
      console.log("Error casting vote.......",error);
    });
  }
}
