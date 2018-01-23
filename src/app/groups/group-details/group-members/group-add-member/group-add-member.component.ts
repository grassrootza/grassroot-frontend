import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupAddMemberInfo} from '../../../model/group-add-member-info.model';
import {GroupService} from '../../../group.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserProvince} from '../../../../user/model/user-province.enum';
import {GroupRole} from '../../../model/group-role';
import {GroupModifiedResponse} from '../../../model/group-modified-response.model';
import {emailOrPhoneEntered, optionalEmailValidator, optionalPhoneValidator} from '../../../../utils/CustomValidators';
import {Observable} from 'rxjs/Observable';
import {Group} from '../../../model/group.model';
import {GroupRelatedUserResponse} from '../../../model/group-related-user.model';
// doing these manually as else there are warnings of very heavy import load if take all rxjs
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/merge";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged";

declare var $: any;

@Component({
  selector: 'app-group-add-member',
  templateUrl: './group-add-member.component.html',
  styleUrls: ['./group-add-member.component.css']
})
export class GroupAddMemberComponent implements OnInit {

  @Output() public onMemberAdded = new EventEmitter<GroupModifiedResponse>();
  @Output() public onMemberAddingFailed = new EventEmitter<any>();

  @Input() groupUid: string = "";

  public addMemberForm: FormGroup;
  public group: Group = null;

  province = UserProvince;
  provinceKeys: string[];

  role = GroupRole;
  roleKeys: string[];

  searching = false;
  lengthInvalid = true;
  searchFailed = false;
  hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);


  constructor(private groupService: GroupService, private fb: FormBuilder) {
    this.provinceKeys = Object.keys(this.province);
    this.roleKeys = Object.keys(GroupRole);
    this.addMemberForm = fb.group(new GroupAddMemberInfo(), { validator: emailOrPhoneEntered("emailAddress", "memberMsisdn")});
    this.setupValidation();
    console.log("alright, ready to work");

  }

  private setupValidation() {
    this.addMemberForm.controls['displayName'].setValidators([Validators.required]);
    this.addMemberForm.controls['roleName'].setValidators([Validators.required]);
    this.addMemberForm.controls['emailAddress'].setValidators(optionalEmailValidator);
    this.addMemberForm.controls['memberMsisdn'].setValidators(optionalPhoneValidator);
  }

  ngOnInit() {
    this.groupService.loadGroupDetails(this.groupUid).subscribe(gr => {
        this.group = gr
    }
    )
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(term => term.length < 3 ? this.lengthInvalid = true : this.lengthInvalid = false)
      .switchMap(term => term.length < 3 ?  Observable.of([]) :
        this.groupService.searchForUsers(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .merge(this.hideSearchingWhenUnsubscribed);

  formatter(x: { name: string, phone: string }) {
    return "Name: " + x.name + ", Phone number: " + x.phone;
  }

  pickedItem(pickedUser: GroupRelatedUserResponse){
    this.addMemberForm.controls['displayName'].setValue(pickedUser.name);
    this.addMemberForm.controls['roleName'].setValue("ROLE_ORDINARY_MEMBER");
    this.addMemberForm.controls['memberMsisdn'].setValue(pickedUser.phone);
    this.addMemberForm.controls['emailAddress'].setValue(pickedUser.email);
    this.addMemberForm.controls['province'].setValue(pickedUser.province);

  }

  postMember() {
    console.log("okay, posting member ...");
    if(this.addMemberForm.controls['affiliations'].value != null){
      let affiliations = this.addMemberForm.controls['affiliations'].value.split(",");
      this.addMemberForm.controls['affiliations'].setValue(affiliations);
    }

    this.groupService.confirmAddMembersToGroup(this.groupUid, [this.addMemberForm.value]).subscribe(result => {
      console.log("got this result back: ", result);
      $('#add-member-modal').modal("hide");
      this.onMemberAdded.emit(result);
    }, error => {
      console.log("well that didn't work: ", error);
      $('#add-member-modal').modal("hide");
      this.onMemberAddingFailed.emit(error);
    })
  }

}
