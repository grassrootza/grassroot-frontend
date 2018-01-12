import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {PasswordResetService} from "../password-reset.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-pwd-reset-validate',
  templateUrl: './pwd-reset-validate.component.html',
  styleUrls: ['./pwd-reset-validate.component.css', '../password-reset.component.css']
})
export class PwdResetValidateComponent implements OnInit {

  otp = new FormControl();
  invalidOtp: boolean = false;

  constructor(private passwordService: PasswordResetService, private router: Router) {
  }

  ngOnInit() {
    // provide no more information than that it is required
    this.otp.setValidators(Validators.required);
  }

  submitOtp() {
    this.passwordService.validateOtp(this.otp.value).subscribe(result => {
      this.invalidOtp = false;
      this.router.navigate(['/forgot/reset']);
    }, error2 => {
      this.invalidOtp = true;
    })
  }



}
