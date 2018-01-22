import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupService} from '../../../../group.service';
import {Membership, MembersPage} from '../../../../model/membership.model';
import {Group} from '../../../../model/group.model';
import {UserService} from '../../../../../user/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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



  constructor(private groupService: GroupService,
              private userService: UserService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createTaskTeamForm = this.formBuilder.group({
      'taskTeamName': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'membersCount': [0, Validators.min(1)]
    });

    this.groupService.fetchGroupMembers(this.group.groupUid, 0, 1, [])
      .subscribe(
        membersPage => {
          console.log(membersPage);
          this.currentPage = membersPage;
          this.createTaskTeamForm.controls['membersCount'].setValue(this.currentPage.totalElements);

        },
        error => {
          if (error.status = 401)
            this.userService.logout();
          console.log('Error loading group members', error.status);
        }
      )
  }

  updateMembersCount(members: Membership[]){
    this.filteredMembers = members;
    this.createTaskTeamForm.controls['membersCount'].setValue(members.length);
  }

  createTaskTeam(){
    let memberUids: string[] = [];
    if (this.filteredMembers.length > 0){
      this.filteredMembers.forEach(fm => memberUids.push(fm.user.uid.toString()));
    }
    let taskTeamName = this.createTaskTeamForm.controls['taskTeamName'].value;
    this.groupService.createTaskTeam(this.group.groupUid, taskTeamName, memberUids).subscribe(
      resp => {
        this.taskTeamSaved.emit();
      }
    )
  }

}
