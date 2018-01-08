import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {JoinService} from "./join.service";
import {JoinInfo, JoinRequest} from "./join-info";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AlertService} from "../utils/alert.service";
import {UserService} from "../user/user.service";

declare var $: any;

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

  groupUid: string;
  code: string;

  public joinForm: FormGroup;
  public joinInfo: JoinInfo = new JoinInfo();
  public joinRequest: JoinRequest = new JoinRequest();

  constructor(private route: ActivatedRoute,
              private joinService: JoinService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private userService: UserService) {
    this.joinForm = formBuilder.group(this.joinRequest);
  }

  // todo: if user is logged in already, don't show / require name, email, etc.
  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log("params: ", params);
      this.groupUid = params['groupId'];
      this.code = params['code'];
      this.joinService.initiateJoinSequence(this.groupUid, this.code).subscribe((result: JoinInfo) => {
        console.log("retrieved this join info: ", result);
        this.joinInfo = result;
      });
    })
  }

  submitJoin() {
    console.log("join form value: ", this.joinForm.value);
    console.log("our object dynamically updated? ", this.joinRequest);
    this.joinService.completeJoinSequence(this.groupUid, this.code, this.joinForm.value)
      .subscribe(result => {
        console.log("result = ", result);
        if (result == 'HAS_PASSWORD') {
          this.alertService.alert("");
        } else {
          console.log("okay, showing modal ...");
          $("#signup-user-modal").modal('show');
        }
      });
  }

  signUpUser(password: string) {
    // this.userService.registerNew(this.)
  }

}
