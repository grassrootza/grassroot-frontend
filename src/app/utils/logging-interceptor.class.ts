import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'

/** Pass untouched request through to the next request handler, while logging */
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("intercepted http request: ", req);
    return next.handle(req)
      .catch((error, caught) => {
//intercept the respons error and displace it to the console
        console.log("Error Occurred: ", error);
//return the error to the method that called it
        return Observable.throw(error);
      }) as any;
  }
}
