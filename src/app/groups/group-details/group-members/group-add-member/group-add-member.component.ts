import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GroupAddMemberInfo} from "../../../model/group-add-member-info.model";
import {GroupService} from "../../../group.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserProvince} from "../../../../user/model/user-province.enum";
import {GroupRole} from "../../../model/group-role";
import {GroupModifiedResponse} from "../../../model/group-modified-response.model";
import {emailOrPhoneEntered, optionalEmailValidator, optionalPhoneValidator} from "../../../../utils/CustomValidators";

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

  province = UserProvince;
  provinceKeys: string[];

  role = GroupRole;
  roleKeys: string[];

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
