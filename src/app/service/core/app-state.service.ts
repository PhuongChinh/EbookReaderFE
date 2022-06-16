import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  constructor() {
    //
  }

  itemPerPage = 300;
  isLoaded: boolean = false
  enableBgBlur: boolean = true

  @Output() menuHamburgerToggleEvent = new EventEmitter<any>();

  @Output() searchChange = new EventEmitter<any>();

  selectedItem: any = {};
  regId: any;

  bizRoles: any = ['BASIC', 'PROFESSIONAL', 'BUSINESS'];

  roles: any = [
    {
      "value": "admin",
      "name": "Administrator"
    },
    {
      "value": "super",
      "name": "Manager"
    }
  ];

  rolesExt: {
    TEACHER: {
      MASTER: 1,
      SPECIFIC: 2
    },
    STUDENT: {
      MASTER: 1,
      SPECIFIC: 2,
      REPORTER: 3
    }
  };

}
