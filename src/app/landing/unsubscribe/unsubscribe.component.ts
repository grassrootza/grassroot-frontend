import {Component} from "@angular/core";
import {UserService} from "../../user/user.service";
import {IncomingResponseService} from "../incoming-response.service";
import {environment} from "../../../environments/environment";
import {RECAPTCHA_URL} from "../../utils/recaptcha.directive";

@Component({
  selector: 'app-group-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css'],
  providers: [{
    provide: RECAPTCHA_URL,
    useValue: environment.recaptchaVerifyUrl
  }]
})
export class UnsubscribeComponent {

  constructor(private userService: UserService,
              private incomingResponseService: IncomingResponseService) {
  }

  

}
