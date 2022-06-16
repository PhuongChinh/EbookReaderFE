import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AppCacheService, AppStateService, AppUtilsService, TeacherService, UserService, UserSessionService } from 'src/app/service';

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
    public userService: UserService,
    public teacherService: TeacherService) {
    this.pageTitle.setTitle('SDB | Home');
  }

  items: any = [];

  scrollOpts = {
    distance: 10,
    throttle: 300,
    scrollWindow: true
  }

  searchText: string = '';
  searchTimer: any = null;

  ngOnInit() {
    this.refreshItems();
  }

  onScroll() {
    this.getItems({ limit: this.state.itemPerPage, skip: this.items.length, order: 'name ASC', include: ['schools'] })
  }

  refreshItems() {
    this.getItems({ limit: this.state.itemPerPage, order: 'name ASC', include: ['schools'] });
  }
  getItems(filter: any = {}) {
    this.teacherService.getTeachers(filter).subscribe((items) => {
      this.items = this.items.concat(items);
    });
  }

  onSearch() {
    console.log('onSearch');
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }
    this.searchTimer = setTimeout(() => {
      this.doSearch();
    }, 600)
  }

  doSearch() {
    console.log('doSearch');
    this.searchText = String(this.searchText).trim();
    let vals = this.searchText.split(/[\s\t\r\n\|\[\]\}\{\=\-\_\)\(\*\&\^\%\$\#\@\!\~\`\\\;\:\"\'\?\/\>\<\.\,\+)}]+/);
    vals = vals.filter(val => val.length > 0);
    if (vals.length > 0) {
      let cond = [];
      vals.forEach(val => {
        cond.push({ name: { ilike: '%' + val + '%' } });
        cond.push({ email: { ilike: '%' + val + '%' } });
      });

      let filter: any = { limit: this.state.itemPerPage, order: 'name ASC', include: ['schools'] };
      if (cond.length > 0) {
        if (!filter.where.and) {
          filter.where.and = [];
        }
        if (cond.length == 1) {
          filter.where.and.push(cond[0]);
        } else {
          filter.where.and.push({ or: cond });
        }
      }

      this.teacherService.getTeachers(filter).subscribe((items) => {
        this.items = items;
      });
    } else {
      this.refreshItems();
    }
  }
}
