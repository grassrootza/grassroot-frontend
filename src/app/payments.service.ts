import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class PaymentsService {

  private paymentInitUrl  = environment.backendAppUrl + "/api/payment/initiate";
  private paymentResultUrl = environment.backendAppUrl + "/api/payment/result";
  
  private shareDonateEmailUrl = environment.backendAppUrl + "/api/donate/share";

  constructor(private httpClient: HttpClient) { }

  initiatePayment(amountZAR: number) {
    console.log("amount ZAR: ", amountZAR);
    let params = new HttpParams().set("amountZAR", "" + amountZAR);
    return this.httpClient.get(this.paymentInitUrl, { params: params, responseType: 'text' }).map(result => {
      return result;
    }, error => {
      console.log("error initiating payment: ", error);
    })
  }

  appendCardScript(document, checkoutId: string) {
    let script = document.createElement('script');
    script.src = `https://test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  checkPaymentResult(resourcePath: string) {
    let params = new HttpParams().set("resourcePath", resourcePath);
    return this.httpClient.get(this.paymentResultUrl, {params: params, responseType: 'text'}); 
  }

  sendDonationShareEmail(senderName: string, emailAddress: string) {
    let params = new HttpParams().set("senderName", senderName).set("emailAddress", emailAddress);
    return this.httpClient.get(this.shareDonateEmailUrl, { params: params });
  }


}
