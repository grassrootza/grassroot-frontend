import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {JoinService} from "./join.service";
import {JoinInfo, JoinRequest} from "./join-info";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

  groupUid: string;
  code: string;

  public joinForm: FormGroup;
  public joinInfo: JoinInfo = null;

  constructor(private route: ActivatedRoute, private joinService: JoinService,
              private formBuilder: FormBuilder) {
    this.joinForm = formBuilder.group(new JoinRequest());
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      console.log("params: ", params);
      this.groupUid = params['groupId'];
      this.code = params['code'];
      this.joinService.initiateJoinSequence(this.groupUid, this.code).subscribe((result: JoinInfo) => {
        console.log("okay, got this stuff back: ", result);
        this.joinInfo = result;
      });
    })
  }

  submitJoin() {
    console.log("join form value: ", this.joinForm.value);
    this.joinService.completeJoinSequence(this.groupUid, this.code, this.joinForm.value)
      .subscribe(result => {
        console.log("result = ", result);
      })
  }

}
