import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { AccountService } from '../../account.service';
import { PaymentsService } from '../../../payments.service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../utils/alert-service/alert.service';
import { AccountSignupResponse } from './signup.response.model';
import { UserService } from '../../user.service';
import { getAuthUser } from '../../user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private STAGES: string[] = ['SELECT_METHOD', 'PAYMENT', 'DETAILS', 'COMPLETE_PAID', 'COMPLETE_TO_PAY', 'PAYMENT_ERROR', 'LOADING'];
  
  public currentStage: string = this.STAGES[0];
  public payingNow: boolean;
  
  public paymentResultUrl: string;
  public creationForm: FormGroup;
  public addAllGroupsToAccount: boolean;

  public accountId: string;

  constructor(private accountService: AccountService, private userService: UserService, private paymentService: PaymentsService, private alertService: AlertService,
              private route: ActivatedRoute, private fb: FormBuilder, @Inject(PLATFORM_ID) protected platformId: Object) { }

  ngOnInit() {
    this.creationForm = this.fb.group({
      'accountName': ['', Validators.required],
      'billingEmail': ['', Validators.required],
      'addAllGroups': ['true'],
      'accountAdmins': ['']
    });

    this.route.url.subscribe(segments => {
      console.log('segments of path: ', segments);
      const penultimateSegment = segments[segments.length - 2];
      if (penultimateSegment && penultimateSegment.path === 'payment')
        this.checkPaymentSuccess();
    });
  }

  initiateAccountCreation(payingNow: boolean) {
    this.currentStage = 'DETAILS';
    this.payingNow = payingNow;
  }

  submitAccountCreation() {
    this.addAllGroupsToAccount = this.creationForm.controls['addAllGroups'].value;
    console.log('add all groups: ', this.addAllGroupsToAccount);
    let accountAdmins = this.creationForm.controls['accountAdmins'].value.split(',').map(s => s.trim());
    console.log('account admins: ', accountAdmins);
    this.alertService.showLoading();
    this.accountService.createAccount(this.creationForm.controls['accountName'].value, this.creationForm.controls['billingEmail'].value,
      this.addAllGroupsToAccount, accountAdmins).subscribe(result => {
        this.alertService.hideLoading();
        console.log('account creation response: ', result);
        if (this.payingNow)
          this.triggerInitialPayment(result['accountId']);
        else
          this.currentStage = 'COMPLETE_TO_PAY';
      }, error => {
        this.alertService.hideLoading();
        console.log('error creating account: ', error);
      })
  }

  storeToken(response: AccountSignupResponse) {
    let adjustedUser = response.refreshedUser;
    console.log('adjusted user: ', adjustedUser);
    this.userService.storeAuthUser(getAuthUser(adjustedUser), adjustedUser.token);
  }

  triggerInitialPayment(accountId: string) {
    this.accountId = accountId;
    this.paymentResultUrl =  environment.frontendAppUrl + "/user/signup/payment/" + accountId;
    console.log('payment result url : ', this.paymentResultUrl);
    this.paymentService.initiatePayment(this.accountService.MONTHLY_SUBSCRIPTION_FEE / 100, true).subscribe(checkoutId => {
      if (isPlatformBrowser(this.platformId)) {
        this.paymentService.appendCardScript(document, checkoutId);
        this.currentStage = 'PAYMENT';
      }
    })
  }

  checkPaymentSuccess() {
    this.currentStage = 'LOADING';
    this.route.params.subscribe(pathParams => {
      this.accountId = pathParams['accountId'];
      console.log('account Id: ', this.accountId);
      this.route.queryParams.subscribe(params => {
        console.log('resource path: ', params['resourcePath']);
        this.paymentService.checkPaymentResult(params['resourcePath']).subscribe(result => {
          console.log('result: ', result);
          if (result && result !== 'PAYMENT_ERROR') {
            this.accountService.updatePaymentRef(this.accountId, result, this.addAllGroupsToAccount).subscribe(result => {
              this.currentStage = 'COMPLETE_PAID';
            })
          } else {
            this.currentStage = 'PAYMENT_ERROR';
          }
        })
      });
    })
  }

  logout() {
    this.userService.logout(false);
    return false;
  }

}
