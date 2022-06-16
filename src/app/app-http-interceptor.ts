import { Injectable } from '@angular/core'

import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserSessionService } from './service'

@Injectable({
  providedIn: 'root'
})
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(public session: UserSessionService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Request intercepted");
    let accessToken = this.session.accessToken;

    if (accessToken) {
      console.log('auth tok: YES');
      request = request.clone({
        'setHeaders': { 'Authorization': this.session.accessToken },
        'withCredentials': true
      });
    } else {
      console.log('auth tok: NONE');
      request = request.clone({
        'withCredentials': true
      });
    }

    return next.handle(request);
  }
}
