import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { saveAs } from 'file-saver';
import {Task} from "../task.model";
import {TaskService} from "../task.service";
import {ItemPercentage} from "../../groups/group-details/group-dashboard/member-detail-percent.model";
import {AlertService} from "../../utils/alert-service/alert.service";
import {MediaFunction} from "../../media/media-function.enum";
import {TaskType} from "../task-type";
import {MediaService} from "../../media/media.service";
import { Router } from '@angular/router';

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
  public totalVotes: number;

  public options: string[];
  public results: ItemPercentage[] = [];

  public imageUrl;
  public imageLoading = false;

  public refreshing = false;

  constructor(private alertService:AlertService,
              private taskService:TaskService,
              private mediaService: MediaService,
              private router: Router) { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['voteToView'] && !changes['voteToView'].firstChange && this.voteToView && this.voteToView.type == 'VOTE') {
      this.taskService.loadTask(this.voteToView.taskUid, "VOTE").subscribe(result => {
        console.log("returned task: ", result);
        this.voteToView = result;
        this.setupResults();
        this.checkForImage();
      }, error => {
        console.log("error fetching task: ", error);
      });
    }
  }

  refreshResults() {
    this.refreshing = true;
    this.taskService.loadTask(this.voteToView.taskUid, TaskType.VOTE).subscribe(result => {
      this.voteToView = result;
      this.setupResults();
      this.refreshing = false;
    })
    return false;
  }

  setupResults() {
    this.totalMembers = this.voteToView.voteResults['TOTAL_VOTE_MEMBERS'];

    this.options = Object.keys(this.voteToView.voteResults).filter(key => key != 'TOTAL_VOTE_MEMBERS');
    this.totalVotes = this.options.map(key => this.voteToView.voteResults[key]).reduce((total, num) => total + num);

    this.results = this.options.map(option => new ItemPercentage(option,
      this.totalVotes > 0 ? Math.round((this.voteToView.voteResults[option] / this.totalVotes) * 100) : 0,
      this.voteToView.voteResults[option]));
  }

  checkForImage() {
    this.taskService.fetchImageKey(this.voteToView.taskUid, TaskType.VOTE).subscribe(response => {
      console.log("image key response: ", response);
      if (response) {
        this.imageLoading = true;
        this.imageUrl = this.mediaService.getImageUrl(MediaFunction.TASK_IMAGE, response);
        // console.log("and here is the image URL: ", this.imageUrl);
      } else {
        this.imageUrl = '';
      }
    });
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

  downloadEventErrorReport() {
    this.taskService.downloadBroadcastErrorReport(this.voteToView.type, this.voteToView.taskUid).subscribe(data => {
      let blob = new Blob([data], { type: 'application/vnd.ms-excel' });
      saveAs(blob, "task-error-report.xls");
    }, error => {
      console.log("error getting the file: ", error);
    });
  }

  closeVote() {
    this.taskService.changeTaskTime(this.voteToView.taskUid, TaskType.VOTE, (new Date).getTime()).subscribe(data => {
      this.voteToView = data;
      console.log('Is the vote now active or not? : ', this.voteToView.isActive);
    })
  }

  editVote() {
    $("#view-vote-modal").modal("hide");
    this.router.navigate(['/task', 'vote', this.voteToView.taskUid]);
    return false;
  }

}
