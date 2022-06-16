import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppCacheService, AppStateService, AppUtilsService, UserServiceService, UserSessionService } from 'src/app/service';

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
    //
  }

}
