import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { AccountService } from '../../account.service';
import { PaymentsService } from '../../../payments.service';
import { isPlatformBrowser } from '@angular/common';
import { environment } from 'environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  private STAGES: string[] = ['SELECT_METHOD', 'PAYMENT', 'DETAILS', 'COMPLETE_PAID', 'COMPLETE_TO_PAY'];
  
  public currentStage: string = this.STAGES[0];
  public payingNow: boolean;
  
  public paymentResultUrl: string;

  public creationForm: FormGroup;

  public accountId: string;

  constructor(private accountService: AccountService,
              private paymentService: PaymentsService,
              private route: ActivatedRoute,
              private fb: FormBuilder, @Inject(PLATFORM_ID) protected platformId: Object) { }

  ngOnInit() {
    this.creationForm = this.fb.group({
      'accountName': ['', Validators.required],
      'billingEmail': ['', Validators.required],
      'addAllGroups': ['true'],
      'accountAdmins': ['']
    });

    this.route.url.subscribe(segments => {
      const penultimateSegment = segments[segments.length - 2];
      console.log('back from payment, last segment: ', penultimateSegment);
      if (penultimateSegment.path === 'payment')
        this.checkPaymentSuccess();
    });
  }

  initiateAccountCreation(payingNow: boolean) {
    this.currentStage = 'DETAILS';
    this.payingNow = payingNow;
  }

  submitAccountCreation() {
    this.accountService.createAccount(this.creationForm.controls['accountName'].value, this.creationForm.controls['billingEmail'].value,
      this.creationForm.controls['addAllGroups'].value, this.creationForm.controls['accountAdmins'].value).subscribe(result => {
        console.log('account creation response: ', result);
        if (this.payingNow)
          this.triggerInitialPayment(result['accountId']);
        else
          this.currentStage = 'COMPLETE_TO_PAY';
      })
  }

  triggerInitialPayment(accountId: string) {
    this.accountId = accountId;
    this.paymentResultUrl =  environment.frontendAppUrl + "/user/signup/payment/" + accountId;
    console.log('payment result url : ', this.paymentResultUrl);
    this.paymentService.initiatePayment(this.accountService.MONTHLY_SUBSCRIPTION_FEE / 100).subscribe(checkoutId => {
      if (isPlatformBrowser(this.platformId)) {
        this.paymentService.appendCardScript(document, checkoutId);
        this.currentStage = 'PAYMENT';
      }
    })
  }

  checkPaymentSuccess() {
    this.route.params.subscribe(pathParams => {
      this.accountId = pathParams['accountId'];
      console.log('account Id: ', this.accountId);
      this.route.queryParams.subscribe(params => {
        console.log('resource path: ', params['resourcePath']);
        this.paymentService.checkPaymentResult(params['resourcePath']).subscribe(result => {
          if (result !== 'PAYMENT_ERROR') {
            this.accountService.updatePaymentRef(this.accountId, result).subscribe(account => {
              this.currentStage = 'COMPLETE_PAID';
            })
          }
        })
      });
    })
  }



}
