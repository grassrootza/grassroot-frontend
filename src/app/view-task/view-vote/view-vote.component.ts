import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Task} from "../../task/task.model";
import {UserService} from "../../user/user.service";
import {TaskService} from "../../task/task.service";
import {ItemPercentage} from "../../groups/group-details/group-dashboard/member-detail-percent.model";
import {AlertService} from "../../utils/alert.service";

declare var $: any;

@Component({
  selector: 'app-view-vote',
  templateUrl: './view-vote.component.html',
  styleUrls: ['./view-vote.component.css']
})
export class ViewVoteComponent implements OnInit, OnChanges {

  @Input() public voteToView:Task;
  @Input() public voteResponse:string;

  public response:string = "";

  public totalMembers: number;
  public options: string[];
  public results: ItemPercentage[] = [];

  constructor(private userService:UserService,
              private alertService:AlertService,
              private taskService:TaskService) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['voteToView'] && !changes['voteToView'].firstChange && this.voteToView && this.voteToView.type == 'VOTE') {
      this.taskService.loadTask(this.voteToView.taskUid, "VOTE").subscribe(result => {
        console.log("returned task: ", result);
        this.voteToView = result;
        this.setupResults();
      }, error => {
        console.log("error fetching task: ", error);
      });
    }
  }

  setupResults() {
    this.totalMembers = this.voteToView.voteResults['TOTAL_VOTE_MEMBERS'];

    this.options = Object.keys(this.voteToView.voteResults).filter(key => key != 'TOTAL_VOTE_MEMBERS');
    let totalVotes = this.options.map(key => this.voteToView.voteResults[key]).reduce((total, num) => total + num);

    this.results = this.options.map(option => new ItemPercentage(option,
      totalVotes > 0 ? Math.round((this.voteToView.voteResults[option] / totalVotes) * 100) : 0,
      this.voteToView.voteResults[option]));
  }

  castVote() {
    this.taskService.castVote(this.voteToView.taskUid, this.response).subscribe(resp =>{
      this.voteToView = resp;
      this.response = "";
      this.setupResults();
      this.alertService.alert("vote done");
      // $("#view-vote-modal").modal("hide");
    },error =>{
      console.log("Error casting vote.......",error);
    });
  }
}
