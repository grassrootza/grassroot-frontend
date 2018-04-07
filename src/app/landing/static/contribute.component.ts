import {Component, Inject, OnInit, PLATFORM_ID} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../utils/alert-service/alert.service";

@Component({
  selector: 'app-front-contribute',
  templateUrl: './contribute.component.html',
  styleUrls: [ '../landing.component.css', './contribute.component.css', './static-matter-general.css' ]
})
export class ContributeComponent implements OnInit {

  public donateError: boolean;

  private donationInitUrl = environment.backendAppUrl + "/api/donate/initiate";
  private donationResultUrl = environment.backendAppUrl + "/api/donate/result";
  private shareDonateEmailUrl = environment.backendAppUrl + "/api/donate/share";

  public displayDonateInput: boolean = true;
  public displayDonateForm: boolean = false;
  public displayShareForm: boolean = false;

  public paymentResultUrl: string = environment.frontendAppUrl + "/contribute/success";
  // public paymentResultUrl: string = "http://localhost:4200/contribute/success";

  public showShareCompleted: boolean = false;

  public shareDonationForm: FormGroup;

  // breaking pattern of only services having http client, but this is _extremely_ specialized, so a whole service
  // would be overkill just to preserve a bit of consistency
  constructor(private httpClient: HttpClient, private router: Router, private route: ActivatedRoute,
              private alertService: AlertService,
              private fb: FormBuilder, @Inject(PLATFORM_ID) protected platformId: Object) {
    this.shareDonationForm = this.fb.group({
      'senderName': ['', Validators.required], // may come back to this and leave it out
      'emailAddress': ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  ngOnInit() {
    this.route.url.subscribe(segments => {
      const lastSegment = segments[segments.length - 1];
      console.log("last segment: ", lastSegment);
      if (!this.checkForSuccess(lastSegment.path))
        this.checkForBrowser();
    });
  }

  checkForBrowser() {
    if (isPlatformBrowser(this.platformId)) {
      this.displayDonateInput = true;
      window.scrollTo(0, 0);
    }
  }

  checkForSuccess(urlLastWord: string): boolean {
    if (urlLastWord === 'success') {
      console.log("donation successful, show thank you, maybe");
      this.route.queryParams.subscribe(params => {
        this.checkDonationResult(params['resourcePath']);
      });
      return true;
    }
    return false;
  }

  initiateDonation(amountZAR: number) {
    console.log("amount ZAR: ", amountZAR);
    let params = new HttpParams().set("amountZAR", "" + amountZAR);
    this.alertService.showLoading();
    this.httpClient.get(this.donationInitUrl, { params: params, responseType: 'text' }).subscribe(result => {
      this.alertService.hideLoadingDelayed();
      this.setUpCreditCardForm(result);
    }, error => {
      console.log("error initiating donation: ", error);
    })
  }

  setUpCreditCardForm(checkoutId: string) {
    if (isPlatformBrowser(this.platformId)) {
      let script = document.createElement('script');
      script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      this.displayDonateInput = false;
      this.displayDonateForm = true;
    }
  }

  checkDonationResult(resourcePath: string) {
    if (resourcePath) {
      let params = new HttpParams().set("resourcePath", resourcePath);
      this.httpClient.get(this.donationResultUrl, {params: params}).subscribe(result => {
        console.log(`checked payment result, we have : ${result}`);
        if (result === 'PAYMENT_SUCCESS') {
          this.displayDonateForm = false;
          this.displayShareForm = true;
        } else {
          this.donateError = true;
        }
      }, error => {
        this.donateError = true;
      });
    } else {
      this.donateError = true;
    }
  }

  sendShareDonationEmail() {
    // do the thing, then:
    if (this.shareDonationForm.valid) {
      let params = new HttpParams().set("senderName", this.shareDonationForm.controls['senderName'].value)
        .set("emailAddress", this.shareDonationForm.controls['emailAddress'].value);
      this.alertService.showLoading();
      this.httpClient.get(this.shareDonateEmailUrl, { params: params }).subscribe(result => {
        this.alertService.hideLoading();
        this.showShareCompleted = true;
      });
    }
  }

}