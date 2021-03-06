import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {JoinService} from "./join.service";
import {JoinInfo} from "./join-info";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../utils/alert-service/alert.service";
import {UserService} from "../../user/user.service";
import {UserProvince} from "../../user/model/user-province.enum";
import {MSG_LANGUAGES} from "../../utils/language";
import {emailOrPhoneEntered, optionalEmailValidator, optionalPhoneValidator} from "../../validators/CustomValidators";
import {User} from "../../user/user.model";

declare var $: any;
const steps: string[] = ["START", "TOPICS", "DONE"];

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {

  code: string;
  groupUid: string;
  broadcastId: string;
  descriptionText: string;

  province = UserProvince;
  provinceKeys: string[];

  languages = MSG_LANGUAGES;

  userLoggedIn: boolean = false;
  joinedUser: User;
  validationCode: string;

  public joinForm: FormGroup;
  public joinInfo: JoinInfo = new JoinInfo();
  public joinTopicsForm: FormGroup;

  public currentStep: string = "";

  // todo : get and store channel of broadcast (e.g., if FB link)
  constructor(private route: ActivatedRoute,
              private joinService: JoinService,
              private formBuilder: FormBuilder,
              private alertService: AlertService,
              private userService: UserService,
              private router: Router) {
    this.currentStep = steps[0];
    this.setUpBasicJoinForm();
    this.joinTopicsForm = this.formBuilder.group({});
  }

  setUpBasicJoinForm() {
    this.provinceKeys = Object.keys(this.province);
    this.joinForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', optionalPhoneValidator],
      email: ['', optionalEmailValidator],
      province: [''],
      language: ['']
    }, { validator: emailOrPhoneEntered("email", "phone") });
  }

  ngOnInit() {
    this.userLoggedIn = this.userService.isLoggedIn();
    if (this.userLoggedIn) {
      this.currentStep = steps[1]; // skip user info if have a session
    }

    this.route.params.subscribe((params: Params) => {
      this.groupUid = params['groupId'];
      this.route.queryParams.subscribe((qParams: Params) => {
        this.code = qParams['code'];
        this.broadcastId = qParams['broadcastId'];
        this.joinService.initiateJoinSequence(this.groupUid, this.code, this.broadcastId).subscribe((result: JoinInfo) => {
          this.joinInfo = result;
          this.descriptionText = this.joinInfo.groupDescription.replace(/\n/g, "</p><p>");
          console.log("description text: ", this.descriptionText);
          this.setUpJoinTopics(this.joinInfo.groupJoinTopics);
        });
      });
    });
  }

  submitJoin() {
    console.log("join form value: ", this.joinForm.value);
    this.alertService.showLoading();
    this.joinService.completeJoinSequence(this.groupUid, this.code, this.broadcastId, this.joinForm.value)
      .subscribe(result => {
        console.log("result = ", result);
        this.validationCode = result.validationCode;
        this.joinedUser = result.user;
        this.currentStep = this.joinInfo.groupJoinTopics && this.joinInfo.groupJoinTopics.length > 0 ? steps[1] : steps[2];
        this.alertService.hideLoading();
      }, error => {
        this.alertService.hideLoading();
      });
  }

  setUpJoinTopics(joinTopics: string[]) {
    if (joinTopics && joinTopics.length > 0) {
      joinTopics.forEach(topic => this.joinTopicsForm.addControl(topic, this.formBuilder.control('')));
    }
  }

  skipTopics() {
    this.currentStep = steps[2];
  }

  submitTopics() {
    let topics = this.joinInfo.groupJoinTopics.filter(topic => this.joinTopicsForm.controls[topic].value);

    this.alertService.showLoading();
    if (this.userLoggedIn) {
      this.joinService.completeJoinForLoggedIn(this.groupUid, this.code, this.broadcastId, topics).subscribe(result => {
        this.proceedToStep(2);
      }, error => {
        console.log("error joining: ", error);
        this.proceedToStep(2);
      })
    } else {
      this.joinService.setTopics(this.groupUid, this.joinedUser.uid, this.validationCode, topics).subscribe(result => {
        console.log("topics set, proceeding to finish");
        this.proceedToStep(2);
      }, error => {
        console.log("topics not set, something wrong, continuing to completion");
        this.proceedToStep(2);
      });
    }
  }

  private proceedToStep(step: number) {
    this.alertService.hideLoading();
    this.currentStep = steps[step];
  }

  signUpUser(password: string) {
    this.alertService.showLoading();
    console.log('initiating sign up ...');
    this.userService.register(this.joinedUser.displayName, this.joinedUser.phoneNumber, this.joinedUser.email,
      password,"").subscribe(loginResult => {
        this.alertService.hideLoading();
        if (loginResult.errorCode == null) {
          this.alertService.alert('join.done.registered', true);
          this.router.navigate(['']);
        } else {
          console.log("error! but shouldn't happen, unless someone trying to spoof, error: ", loginResult);
        }
    })
  }

}
