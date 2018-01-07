import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {JoinService} from "./join.service";
import {JoinInfo} from "./join-info";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

  public joinGroupForm: FormGroup;

  constructor(private route: ActivatedRoute, private joinService: JoinService,
              private formBuilder: FormBuilder) {
    this.joinGroupForm = formBuilder.group({
      'name': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'phone': ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      'email': ['', Validators.compose([Validators.required, Validators.email, Validators.minLength(3)])],
      'province': 'SELECT',
      'topics': ''
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      console.log("params: ", params);
      this.joinService.initiateJoinSequence(params['groupUid'], params['code']).subscribe((result: JoinInfo) => {
        console.log("okay, got this stuff back: ", result);
      });
    })
  }

}
