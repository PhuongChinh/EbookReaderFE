import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, last, finalize, catchError } from 'rxjs/operators';

import { UserSessionService } from './user-session.service';
import { AppStateService } from './app-state.service';
import { CONSUME_API } from '../consume-apis'
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HttpConnectorService {

  constructor(
    protected session: UserSessionService,
    protected state: AppStateService,
    protected httpClient: HttpClient,
    protected toastr: ToastrService,
    protected router: Router
  ) {
    this.isIE = /(Edge\/)|(Trident\/)|(MSIE\s)/.test(window.navigator.userAgent)
    this.apiUrl = this.unifineURL(this.apiUrl)

  }

  isIE: boolean = false;
  get isLoaded(): boolean {
    return this.state.isLoaded;
  }

  set isLoaded(v: boolean) {
    this.state.isLoaded = v;
  }

  loadingStack: any[] = [];

  apiUrl = CONSUME_API.apiUrl;

  headers = {
    jsondata: {
      'headers': {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json'
      }
    },
    formdata: {
      'headers': {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        'Accept': 'application/json'
      }
    }
  }

  public buildBodyParam(param: any) {
    let body = new HttpParams();
    if (param) {
      for (let k in param) {
        body = body.set(k, param[k]);
      }
    }
    let ps = body.toString();
    return ps;
  }
  public handleError(error: any, isNotSilenceLoad: boolean = true) {

    let msg = 'An error occurred while communicating with server side. please try again later';
    if (!error) {
      this.toastr.warning(msg);
      return;
    } if (error.status == 0) {
      if (isNotSilenceLoad) {
        this.toastr.warning('Please check user experience of network connection problem and try again');
      }
      return;
    }
    if ((error.status == 401 || error.status == 403) && (error.url && error.url.lastIndexOf('/api/v1/auth/') !== -1)) {

      if (error.status == 401) {

        if (this.session.isAuthenticated) {
          if (isNotSilenceLoad) {
            this.toastr.warning('Your session is timed out. Please log in again to continue your works');
          }
          this.session.clearSession();
          this.router.navigate(['/ui/login']);
        }
        return;
      }
      if (isNotSilenceLoad) {
        this.toastr.warning('Access Denied. Please contact administrator for more information');
      }
      return;
    }

    if (error.status == 500) {
      if (isNotSilenceLoad) {
        this.toastr.warning('Could not continue your work due to server problem at this moment. Please contact administrator for more information');
      }
      return;
    }


    if (typeof error === 'string') {
      msg = error;
    } else {
      if (error.error && error.error.message) {
        msg = error.error.message;
      } else if (error.statusText) {
        msg = error.statusText;
      }
    }
    this.toastr.warning(msg);
  };

  public _req(method: string, uri: string,
    pl: any = undefined, options: any = undefined,
    isNotSilenceLoad: boolean = true): Observable<any> {
    let url = this.supportIE(this.apiUrl + uri, this.apiUrl)


    let reqH = ((options && options.headers) ? options.headers : this.headers.jsondata);

    if (method === 'get' || method === 'delete' || method === 'head') {
      let reqParams = ((options && options.params) ? options.params : undefined);
      if (reqParams) {
        reqH = Object.assign(reqH, reqParams);
      }
      pl = reqH;
      reqH = undefined;
    }
    if (pl instanceof FormData) {
      reqH = undefined;
    }

    if (!(pl && pl.silent)) {
      this.loadingStack.push(method + ':' + uri);
      this.isLoaded = false;
    }

    let req = this.httpClient[method]<any>(url, pl, reqH).pipe(tap(event => {
      //
    }, error => {
      //
    }),
      finalize(() => {
        this.loadingStack.pop();
        this.isLoaded = (this.loadingStack.length === 0);

        return req;
      }),
      catchError(err => {
        this.loadingStack.pop();
        this.isLoaded = (this.loadingStack.length === 0);
        this.handleError(err, isNotSilenceLoad);
        return throwError(err);
      }));
    return req;
  }

  public _reqPromise(method: string, uri: string,
    payload: any = undefined, options: any = undefined): any {
    return new Promise((resolve, reject) => {
      this._req(method, uri, payload, options).subscribe((res: any) => {
        resolve(res);
      }, (err: any) => {
        reject(err);
      })
    });
  }

  public get(uri: string, filter: any = undefined): Observable<any> {
    if (typeof filter == 'object') {
      let params = this.buildBodyParam(filter);
      if (uri.lastIndexOf('?') > 0) {
        uri = uri + '&' + params;
      } else {
        uri = uri + '?' + params;
      }
    }
    return this._req('get', uri);
  }

  public delete(uri: string): Observable<any> {
    return this._req('delete', uri);
  }

  public post(uri: string, payload: any) {
    return this._req('post', uri, payload);
  }

  public put(uri: string, payload: any): Observable<any> {
    return this._req('put', uri, payload);
  }

  public patch(uri: string, payload: any): Observable<any> {
    return this._req('patch', uri, payload);
  }

  public getBlob(uri: string): Observable<any> {
    let url = this.supportIE(uri)
    return this.httpClient.get(url, {
      responseType: 'blob', observe: 'response'
    });
  }

  public postForm(uri: string, param: any): Observable<any> {
    let ps = this.buildBodyParam(param);
    return this._req('post', uri, ps, { 'headers': this.headers.formdata });
  }

  supportIE(url: string, rootUrl?: string): string {
    if (this.isIE) {
      let rand = Math.round(Math.random() * 10000000)

      if (url.lastIndexOf('?') > 0) {
        url += '&r' + rand
      } else {
        url += '?r' + rand
      }
    }
    return this.unifineURL(url, rootUrl)
  }
  unifineURL(url: string, rootUrl?: string) {
    if (url.indexOf('http') !== 0) {
      let protocol = location.protocol
      if (url.indexOf('//') !== 0 || url.indexOf('://') !== 0) {
        if (rootUrl && url.indexOf(rootUrl) === -1) {
          url = rootUrl + url
        } else {
          url = protocol + '//' + url
        }
      } else {
        url = protocol + url
      }
    }
    return url;
  }
}
