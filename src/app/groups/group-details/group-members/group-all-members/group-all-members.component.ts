import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {UserService} from '../../../../user/user.service';
import {GroupService} from '../../../group.service';
import {Membership, MembersPage} from '../../../model/membership.model';

@Component({
  selector: 'app-group-all-members',
  templateUrl: './group-all-members.component.html',
  styleUrls: ['./group-all-members.component.css']
})
export class GroupAllMembersComponent implements OnInit {


  public currentPage:MembersPage = new MembersPage(0,0, 0,0, true, false, []);
  private groupUid: string = '';

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private groupService: GroupService) {
  }

  ngOnInit() {

    this.route.parent.parent.params.subscribe((params: Params) => {
      this.groupUid = params['id'];
      this.goToPage(0);
    });
  }


  selectMember(member: Membership) {
    member.selected = true;
  }

  goToPage(page: number){
    this.groupService.fetchGroupMembers(this.groupUid, page, 10)
      .subscribe(
        membersPage => {
          this.currentPage = membersPage;
        },
        error => {
          if (error.status = 401)
            this.userService.logout();
          console.log('Error loading group members', error.status);
        }
      )
  }




}
