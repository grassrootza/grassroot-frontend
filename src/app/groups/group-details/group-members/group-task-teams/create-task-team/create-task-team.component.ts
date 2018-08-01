import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupService} from '../../../../group.service';
import {Membership, MembersPage} from '../../../../model/membership.model';
import {Group} from '../../../../model/group.model';
import {UserService} from '../../../../../user/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MembersFilter} from "../../../../member-filter/filter.model";
import {CampaignInfo} from "../../../../../campaigns/model/campaign-info";
import {CampaignService} from "../../../../../campaigns/campaign.service";

@Component({
  selector: 'app-create-task-team',
  templateUrl: './create-task-team.component.html',
  styleUrls: ['./create-task-team.component.css']
})
export class CreateTaskTeamComponent implements OnInit {

  @Input()
  group: Group = null;

  @Output()
  public taskTeamSaved: EventEmitter<any> = new EventEmitter();

  public currentPage:MembersPage = new MembersPage(0,0, 0,0, true, false, []);

  private filteredMembers: Membership[] = [];

  public createTaskTeamForm: FormGroup;

  groupCampaigns: CampaignInfo[] = [];


  constructor(private groupService: GroupService,
              private campaignService: CampaignService,
              private userService: UserService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.campaignService.loadGroupCampaigns(this.group.groupUid)
      .subscribe(
        campaigns => {
          this.groupCampaigns = campaigns;
        },
        error => {
          console.log("Failed to fetch group campaigns", error);
        }
      );

    this.createTaskTeamForm = this.formBuilder.group({
      'taskTeamName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'membersCount': [0, Validators.min(1)]
    });

  }

  membersFilterChanged(filter: MembersFilter) {
    if (filter.hasContent()) {
      this.groupService.filterGroupMembers(this.group.groupUid, filter)
        .subscribe(
          members => {
            this.filteredMembers = filter.role == 'ANY' ? members.content : members.content.filter(m => m.roleName == filter.role);
            console.log(`filtered on role: ${filter.role}, used role = ${filter.role == 'ANY'}`);
            this.createTaskTeamForm.controls['membersCount'].setValue(this.filteredMembers.length);
          },
          error => console.log("Error fetching members", error)
        );
    } else {
      this.filteredMembers = [];
      this.createTaskTeamForm.controls['membersCount'].setValue(0);
    }
  }

  createTaskTeam() {
    let memberUids: string[] = [];
    if (this.filteredMembers.length > 0){
      this.filteredMembers.forEach(fm => memberUids.push(fm.userUid.toString()));
    }
    let taskTeamName = this.createTaskTeamForm.controls['taskTeamName'].value;
    this.groupService.createTaskTeam(this.group.groupUid, taskTeamName, memberUids).subscribe(
      resp => {
        this.taskTeamSaved.emit();
      }
    )
  }

}
