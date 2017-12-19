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
  public pagesList: number[] = [];
  public currentSectionToDisplay: number;
  public numberOfSections: number;

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
          this.generatePagesList();
        },
        error => {
          if (error.status = 401)
            this.userService.logout();
          console.log('Error loading group members', error.status);
        }
      )
  }

  previousPage(){
    if(!this.currentPage.first)
      this.goToPage(this.currentPage.number - 1);

  }

  nextPage(){
    if(!this.currentPage.last)
      this.goToPage(this.currentPage.number + 1);
  }

  generatePagesList(){
    this.pagesList = [];

    if(this.currentPage.totalPages <= 3){
      for(let i=0; i < this.currentPage.totalPages; i++) {
        this.pagesList.push(i);
      }
    }else{
      this.numberOfSections = this.currentPage.totalPages / 3;
      this.currentSectionToDisplay = Math.floor(this.currentPage.number / 3);
      let sectionStart = this.currentSectionToDisplay * 3;
      let sectionEnd = sectionStart + 2;
      for(let i = sectionStart; i <= sectionEnd; i++){
        this.pagesList.push(i);
      }
     }

  }


}
