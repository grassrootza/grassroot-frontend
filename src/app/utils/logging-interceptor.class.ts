import {throwError as observableThrowError,  Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';



/** Pass untouched request through to the next request handler, while logging */
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("intercepted http request: ", req);
    return next.handle(req)
      .pipe(catchError((error, caught) => {
//intercept the respons error and displace it to the console
        console.log("Error Occurred: ", error);
//return the error to the method that called it
        return observableThrowError(error);
      }) as any);
  }
}
