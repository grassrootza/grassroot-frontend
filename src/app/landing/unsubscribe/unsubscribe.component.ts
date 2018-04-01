import {Component, OnInit} from "@angular/core";
import {UserService} from "../../user/user.service";
import {IncomingResponseService} from "../incoming-response.service";
import {environment} from "../../../environments/environment";
import {RECAPTCHA_URL} from "../../utils/recaptcha.directive";
import {ActivatedRoute, Params} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-group-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css'],
  providers: [{
    provide: RECAPTCHA_URL,
    useValue: environment.recaptchaVerifyUrl
  }]
})
export class UnsubscribeComponent implements OnInit {

  public isLoggedIn: boolean = false;

  private groupId: string;
  private userId: string;
  private token: string;

  public recaptcha: FormControl;

  public groupName: string;

  public succeeded: boolean = false;
  public failed: boolean = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder,
              private userService: UserService,
              private incomingResponseService: IncomingResponseService) {
    this.recaptcha = new FormControl();
  }

  ngOnInit() {
    this.isLoggedIn = this.userService.isLoggedIn();

    this.route.params.subscribe((params: Params) => {
      this.groupId = params['groupId'];
      this.userId =  params['userId'];
      this.token = params['token'];
      this.fetchGroupName();
    });
  }

  fetchGroupName() {
    this.incomingResponseService.fetchGroupName(this.userId, this.groupId, this.token).subscribe(groupName => {
      console.log(`retrieved group name: ${groupName}`);
      this.groupName = groupName;
    });
  }

  submitUnsubscribe() {
    if (this.isLoggedIn || this.recaptcha.valid) {
      this.incomingResponseService.unsubscribeFromGroup(this.userId, this.groupId, this.token).subscribe(response => {
        console.log(`unsubscribe succeeded! : ${response}`);
        this.succeeded = true;
      }, error => {
        console.log(`unsubscribe didn't work, error: ${error}`);
        this.failed = true;
      });
    }
  }

}
