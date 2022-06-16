import { Injectable, Output, EventEmitter } from '@angular/core';


import { AppUtilsService } from '../app-utils.service';
import { AppStateService } from './app-state.service';
import { UserSessionService } from './user-session.service';
import { HttpConnectorService } from './http-connector.service'
import { CONSUME_API } from '../consume-apis'
import { ToastrService } from 'ngx-toastr'
import { Router } from "@angular/router"

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  @Output() onAuthen = new EventEmitter<any>()

  constructor(protected utils: AppUtilsService,
    protected session: UserSessionService,
    protected state: AppStateService,
    protected xhr: HttpConnectorService,
    private toastr: ToastrService,
    protected router: Router
    ) {
  }

  public logoutUser() {

    return new Promise((resolve, reject) => {

      this.xhr.get(CONSUME_API.AUTH_USERS.logOut + '?access_token=' + this.session.accessToken).subscribe((resp: any) => {


        resolve(true);
      }, (err) => {

        reject(err);
      })
    })
  }

  public login(credential: any) {
    return new Promise((resolve, reject) => {
      this.xhr.post(CONSUME_API.AUTH_USERS.logIn, credential).subscribe(async (resp: any) => {
        if (!resp) {
          resolve(false);
          return;
        }
        if (resp.user) {
          this.session.setUser(resp.user);
          this.session.setAccessToken(resp);

          resolve(resp.user);
          this.onAuthen.emit(this.session.isAuthenticated);
        } else {
          resolve(false);
        }
      }, (err) => {

        reject(err);
      })
    })
  }

  public refreshToken() {
    return new Promise((resolve, reject) => {
      this.xhr.post(CONSUME_API.AUTH_USERS.refreshToken, {}).subscribe(async (resp: any) => {
        if (!resp) {
          resolve(false);
          return;
        }
        
        if (resp.user) {
          this.session.setUser(resp.user);
          this.session.setAccessToken(resp);

          resolve(resp.user);
          this.onAuthen.emit(this.session.isAuthenticated);
        } else {
          resolve(false);
        }
      }, (err) => {
        reject(err);
      })
    })
  }

  public userSignUp(payload: any) {
    return new Promise((resolve, reject) => {
      this.xhr.post(CONSUME_API.AUTH_USERS.signUp, payload).subscribe((resp: any) => {
        resolve(resp);
      }, (err) => {
        reject(err);
      })
    })
  }
  public verifyEmail(payload: any) {
    return new Promise((resolve, reject) => {
      this.xhr.post(CONSUME_API.AUTH_USERS.verifyEmail, payload).subscribe((resp: any) => {
        resolve(resp);
      }, (err) => {
        reject(err);
      })
    })
  }
}
