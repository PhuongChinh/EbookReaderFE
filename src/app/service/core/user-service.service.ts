import { Injectable, Output, EventEmitter } from '@angular/core';


import { AppUtilsService } from '../app-utils.service';
import { AppStateService } from './app-state.service';
import { UserSessionService } from './user-session.service';
import { HttpConnectorService } from './http-connector.service'

import { CONSUME_API } from '../consume-apis'

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  @Output() onAuthen = new EventEmitter<any>()

  constructor(protected utils: AppUtilsService,
    protected session: UserSessionService,
    protected state: AppStateService,
    protected xhr: HttpConnectorService) {
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

  public loginUser(credential: any) {
    return new Promise((resolve, reject) => {
      this.xhr.post(CONSUME_API.AUTH_USERS.logIn, credential).subscribe((resp: any) => {
        if (!resp) {
          resolve(false);
          return;
        }
        if (resp.user) {
          let user = Object.assign({}, resp.user);
          this.session.setUser(user);
          this.session.setAccessToken(resp);
          resolve(user);
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
      this.xhr.post(CONSUME_API.AUTH_USERS.refreshToken, {}).subscribe((resp: any) => {
        if (!resp) {
          resolve(false);
          return;
        }
        if (resp.user && resp) {
          let user = Object.assign({}, resp.user);
          this.session.setUser(user);
          this.session.setAccessToken(resp);
          resolve(user);
        } else {
          resolve(false);
        }
      }, (err) => {
        reject(err);
      })
    })
  }
}
