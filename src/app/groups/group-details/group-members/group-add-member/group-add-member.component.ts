import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupAddMemberInfo} from '../../../model/group-add-member-info.model';
import {GroupService} from '../../../group.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserProvince} from '../../../../user/model/user-province.enum';
import {GroupRole} from '../../../model/group-role';
import {GroupModifiedResponse} from '../../../model/group-modified-response.model';
import {emailOrPhoneEntered, optionalEmailValidator, optionalPhoneValidator} from '../../../../utils/CustomValidators';
import {Observable} from 'rxjs/Observable';
import {GroupMembersAutocompleteResponse} from '../../../model/group-members-autocomplete-response.model';

declare var $: any;

const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

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

  formatter(x: { value: string, label: string }) {
    return "Name: " + x.label + ", Phone number: " + x.value;
  }

  pickedItem(pickedUser: GroupMembersAutocompleteResponse){
    //TODO: implement filling rest of the form with user data when user is picked, need to fetch user details from server
    this.addMemberForm.controls['displayName'].setValue(pickedUser.label);
    this.addMemberForm.controls['roleName'].setValue("ROLE_ORDINARY_MEMBER");
    this.addMemberForm.controls['memberMsisdn'].setValue(pickedUser.value);

  }

  postMember() {
    console.log("okay, posting member ...");
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
