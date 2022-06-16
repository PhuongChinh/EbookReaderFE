import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router"

import { UserSessionService, AppUtilsService, AppStateService, AppCacheService, UserServiceService } from '../../service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(public state: AppStateService,
    public cache: AppCacheService,
    public session: UserSessionService,
    public router: Router,
    public utils: AppUtilsService,
    public userService: UserServiceService,
  ) {
  }

  ngOnInit() {
    
  }

}
