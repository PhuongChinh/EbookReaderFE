import { Injectable } from '@angular/core'
import { Router } from "@angular/router"
import { constants } from 'buffer'

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

  get currentUser(): any {
    return this.user;
  }

  user: any = {}
  tok: any = {}
  lesson: any = [];

  constructor(public router: Router, public cache: AppCacheService) {

    // get from cached
    let tok = this.getEncodeCached(this.ssAccessToken);
    if (tok) {
      this.setAccessToken(tok);
    }

    console.log('User Token still valid?: ', (this.isAuthenticated ? 'Yes' : 'No'));
  }

  setUser(user: any) {
    console.log('setUser', user)
    if (user && user.id) {
      this.user = user;
      this.storeUserEnv();
    }
  }
  refreshUserBasicInfor(phone: string, name: string) {
    this.user.username = name;
    this.user.phone = phone;
  }

  setUserProfile(profile: any) {
    this.user.profile = profile;
    this.user.currentSchool = profile.lstSchool[0];
  }
  setActivedCodeOfUser(lstCode: any) {
    this.user.activedAccessCodes = lstCode;
  }
  setListClazz(lstClazz: any) {
    this.user.listClazz = lstClazz;
  }
  setCurrentSchool(school: any) {
    this.user.currentSchool = school;
  }
  setAccessToken(tok: any) {
    if (tok && tok.id) {
      tok.token = tok.id;
    }
    this._isAuth = this._validateTok(tok);
    if (this._isAuth) {
      this.tok = tok;
      this.storeUserEnv();
    }
  }

  clearSession() {
    console.log('clearSession')
    this.user = {};
    this.tok = {};
    this._isAuth = false;
    this.cache.removeCache(this.ssAccessToken);
  }

  get profile() {
    return (this.user && this.user.profile) || {};
  }

  // User roles
  get isAdmin() {
    return this.profile && this.profile.isSchoolOwner;
  }
  //"students"
  get isManager() {
    return this.profile && this.profile.isManager;
  }
  get isTeacher() {
    return this.profile && this.profile.isTeacher;
  }
  get isStudent() {
    return this.profile && this.profile.isStudent;
  }
  get isParent() {
    return this.profile && this.profile.isParent;
  }
  get isNoOne(): boolean {
    return !(this.profile && (this.profile.isSchoolOwner || this.profile.isManager || this.profile.isTeacher || this.profile.isStudent || this.profile.isParent));
  }

  storeUserEnv() {
    if (this.user.id) {
      this.setEncodeCached(this.ssUserId, this.user.id);
    }
    if (this.tok.id) {
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
    let activateLink = '';
    return [
      { path: '/ui/2/class/19/logbook/DETAIL', share: true },
      { path: activateLink, enable: activateLink ? true : false },
      { path: '/ui/managers', enable: this.isManager },
      { path: '/ui/teachers', enable: this.isTeacher },
      { path: '/ui/students', enable: this.isStudent },
      { path: '/ui/parents', enable: this.isParent },
      { path: '/ui/home', enable: true },//default to home
    ];
  }

  setTimeTableDetail(timetable) {
    this.lesson = timetable;
  }

  get timetableDetail() {
    return this.lesson;
  }

  get currentSchool() {
    return (this.user && this.user.currentSchool) ||{}
  }
}
