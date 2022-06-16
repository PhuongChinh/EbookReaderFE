import { Injectable } from '@angular/core'
import { Router } from "@angular/router"

import { AppCacheService } from './app-cache.service'

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {

  ssPrefix: string = ''
  ssUserId: string = this.ssPrefix + 'userId'
  ssAccessToken: string = this.ssPrefix + 'access_token'

  _isAuth: boolean = false;


  get isAuthenticated(): boolean {
    return this._isAuth;
  }

  set isAuthenticated(val: boolean) {
    console.log("isAuthenticated is READ-ONLY property");
  }

  get userId(): string {
    return this.user.id;
  }

  set userId(val: string) {
    console.log("userId is READ-ONLY property");
  }

  get accessToken(): string {
    console.log("get accessToken");
    return this.tok.id;
  }

  set accessToken(val: string) {
    console.log("accessToken is READ-ONLY property");
  }

  user: any = {};
  tok: any = {}

  constructor(public router: Router, public cache: AppCacheService) {

    // get from cached
    let tok = this.getEncodeCached(this.ssAccessToken);
    if (tok) {
      this.setAccessToken(tok);
      //console.log('---------------> tok', tok)
    }

    console.log('User Token still valid?: ', (this.isAuthenticated ? 'Yes' : 'No'));
  }

  setUser(user: any) {
    console.log('setUser')
    if (user && user.id) {
      this.user = user;
      this.storeUserEnv();
      if (this.user.email && this.user.id && this.accessToken) {
        this._isAuth = true;
      }
    }
  }

  setAccessToken(tok: any) {
    console.log('setAccessToken')
    if (tok && tok.id) {
      this.tok = tok;
      this.storeUserEnv();
      this.user.id = this.tok.userId;
      if (this.user.email && this.user.id && this.accessToken) {
        this._isAuth = true;
      }
    }
    //console.log('setAccessToken isAuthenticated', this.isAuthenticated)
  }

  clearSession() {
    console.log('clearSession')
    this.user = {};
    this.tok = {};
    this._isAuth = false;
    this.cache.deleteCookie(this.ssAccessToken);
    this.cache.removeCache(this.ssAccessToken);
  }

  // User roles
  get isAdmin() {
    return this.hasRole(["admin", "super"]);
  }
  get isManager() {
    //return this.hasRole(['MANAGER']);
    return false;
  }
  //"teachers", "students", "schoolParents", "studentParents"
  get isTeacher() {
    return this.hasSchoolRole('teachers');
  }
  get isStudent() {
    return this.hasSchoolRole('students');
  }
  get isParent() {
    return this.hasSchoolRole('schoolParents');
  }
  get isNoOne(): boolean {
    return !(this.user && this.user.roles && this.user.roles.length > 0);
  }

  hasRole(names: any) {
    if (this.user && this.user.roles) {
      let roles = this.user.roles;
      for (let r of roles) {
        if (Array.isArray(names)) {
          for (let nm of names) {
            if (r.value == nm) {
              return true;
            }
          }
        } else if (r.value == names) {
          return true;
        }
      }
    }
    return false;
  }

  hasSchoolRole(fields: string) {
    if (this.user && this.user[fields]) {
      let roles = this.user[fields];
      return roles.length > 0;
    }
    return false;
  }

  storeUserEnv() {

    if (this.user.id) {
      this.cache.setCookie(this.ssUserId, this.user.id);
      this.setEncodeCached(this.ssUserId, this.user.id);
    }
    if (this.tok.id) {
      this.cache.setCookie(this.ssAccessToken, this.tok.token);
      this.setEncodeCached(this.ssAccessToken, this.tok);
    }
    // reveal


  }

  _validateTok(tok: any): boolean {

    if (tok && tok.created && tok.id && tok.ttl && tok.userId) {
      let now = new Date().getTime();
      let t = this.fixIOSDate(tok.created).getTime();
      let ttl = tok.ttl;
      let dis = (now - t) / 1000 - ttl;
      console.log('_validateTok is expired?', (dis > 0 ? 'YES' : 'NO'), dis, ttl);
      return (dis < 0);
    }
    return false;
  }

  fixIOSDate(iso8601DateString: any) {
    let d = new Date(iso8601DateString);
    if (isNaN(d.getTime())) {
      let s = iso8601DateString.replace(/[\:\T\.\+\/\s]+/g, "-").split("-");
      if (s.length > 5) {
        d = new Date(s[0], s[1], s[2], s[3], s[4], s[5]);
      } else if (s.length > 4) {
        d = new Date(s[0], s[1], s[2], s[3], s[4]);
      } else if (s.length > 3) {
        d = new Date(s[0], s[1], s[2], s[3]);
      } else if (s.length > 2) {
        d = new Date(s[0], s[1], s[2]);
      }
    }
    return d;
  }

  setEncodeCached(key: string, val: any) {
    console.log('setEncodeCached', key)
    if (!key || !val || typeof val !== 'object' || Array.isArray(val)) {
      console.log('Unsupported save to cache-storage');
      return;
    }
    try {
      val._lastTime = new Date().getTime();
      let ss = window.btoa(JSON.stringify(val));
      this.cache.setCache(key, ss);
    } catch (e) { }
  }

  getEncodeCached(key: string) {
    console.log('getEncodeCached', key)
    if (!key || typeof key !== 'string') {
      console.log('Unsupported get from cache-storage');
      return null;
    }
    let val = this.cache.getCache(key);
    try {
      val = JSON.parse(window.atob(val));
    } catch (e) { }
    return (val && val._lastTime) ? val : null;
  }


  getBrowserUserId() {
    return this.getEncodeCached(this.ssUserId);
  }

  get startPaths() {
    return [
      { path: '/ui/org', enable: this.isAdmin },
      { path: '/ui/managers', enable: this.isManager },
      { path: '/ui/teachers', enable: this.isTeacher },
      { path: '/ui/students', enable: this.isStudent },
      { path: '/ui/parents', enable: this.isParent },
      { path: '/ui/dashboard', enable: true },//default to home
    ];
  }
}
