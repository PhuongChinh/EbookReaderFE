import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserSessionService, AppUtilsService, AppStateService, AppCacheService, UserService } from '../../service'


@Component({
  selector: 'app-daskboard',
  templateUrl: './daskboard.component.html',
  styleUrls: ['./daskboard.component.scss']
})
export class DaskboardComponent implements OnInit {

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
    this.pageTitle.setTitle('SDB | Dashboard');
  }
  ngOnInit() {
    //
  }
}
