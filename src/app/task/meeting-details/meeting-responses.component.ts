import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MembershipInfo} from "../../groups/model/membership.model";
import {ItemPercentage} from "../../groups/group-details/group-dashboard/member-detail-percent.model";

declare var $: any;

@Component({
  selector: 'app-meeting-responses',
  templateUrl: './meeting-responses.component.html',
  styleUrls: ['./meeting-responses.component.css']
})
export class MeetingResponsesComponent implements OnInit, OnChanges {

  @Input() public responses: Map<string, string>;

  public members: MembershipInfo[] = [];
  public responseCounts: ItemPercentage[] = [];

  public responseOptions: string[] = ['YES', 'NO', 'MAYBE', 'NO_RESPONSE'];
  public totalMembers: number;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['responses'] && !changes['responses'].firstChange) {
      console.log("meeting results: ", this.responses);
      let values = Object.keys(this.responses).map(key => this.responses[key]);
      console.log("values: ", values);
      this.totalMembers = values.length;
      console.log("number of members: ", this.totalMembers);
      this.responseOptions.forEach(option => {
        let count = this.countResponses(option, values);
        let percent = Math.round((count / this.totalMembers) * 100);
        this.responseCounts[option] = new ItemPercentage(option, percent, count);
      });
      console.log("response counts, yes: ", this.responseCounts['YES']);
    }
  }

  countResponses(response: string, responses: string[]): number {
    let count = 0;
    for (let i = 0; i < responses.length; i++)
      if (responses[i] == response)
        count++;
    return count;
  }

}
