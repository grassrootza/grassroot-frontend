import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserProvince} from '../../user/model/user-province.enum';
import {GroupService} from '../group.service';
import {Group} from '../model/group.model';
import {UserService} from '../../user/user.service';
import {Membership} from '../model/membership.model';

@Component({
  selector: 'app-member-filter',
  templateUrl: './member-filter.component.html',
  styleUrls: ['./member-filter.component.css']
})
export class MemberFilterComponent implements OnInit {

  @Input() groupUid: string = "";

  @Output() public members: EventEmitter<Membership[]> = new EventEmitter();

  province = UserProvince;
  provinceKeys: string[];
  public group: Group = null;

  public selectedProvince = null;
  public selectedTaskTeams = null;
  public selectedTopics = null;

  constructor(private groupService: GroupService,
              private userService: UserService) {
    this.provinceKeys = Object.keys(this.province);
  }

  ngOnInit() {
    console.log(this.groupUid);
    this.groupService.loadGroupDetails(this.groupUid)
      .subscribe(
        groupDetails => {
          this.group = groupDetails;
          console.log(this.group);
        },
        error => {
          if (error.status = 401)
            this.userService.logout();
          console.log("Error loading groups", error.status)
        }
      );
  }

  filterData(){
    console.log(this.selectedProvince);
    console.log(this.selectedTaskTeams);
    this.groupService.filterGroupMembers(this.groupUid, this.selectedProvince, this.selectedTaskTeams, this.selectedTopics).subscribe(resp => {
      this.members.emit(resp);
    })
  }
}
