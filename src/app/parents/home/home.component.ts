import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AppCacheService, AppStateService, AppUtilsService, UserService, UserSessionService } from 'src/app/service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    protected pageTitle: Title,
    public state: AppStateService,
    public cache: AppCacheService,
    public session: UserSessionService,
    public translate: TranslateService,
    protected router: Router,
    protected utils: AppUtilsService,
    protected toastr: ToastrService,
    public userService: UserService) {
    this.pageTitle.setTitle('SDB | Home');
  }
  ngOnInit() {
    //
  }

}
