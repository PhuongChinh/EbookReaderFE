import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { Router } from "@angular/router"
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';


import { UserSessionService } from './service'
import { AppUtilsService } from './service'
import { AppStateService } from './service'
import { AppCacheService } from './service'
import { UserServiceService } from './service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public translate: TranslateService, public state: AppStateService,
    public cache: AppCacheService,
    public session: UserSessionService,
    public router: Router,
    public utils: AppUtilsService,
    public userService: UserServiceService,
  ) {
    let langs = ['en', 'vi'];
    //Force to load all lang!
    langs.forEach(lang => {
      translate.getTranslation(lang).subscribe(res => {

      });
    });

    translate.addLangs(langs);
    translate.setDefaultLang('en');

    let lang = this.utils.getParamQueryString('lang');

    if (lang && lang.match(/en|ja|vi|fr/)) {
      translate.use(lang);
    } else {
      lang = this.cache.getCookie('lang');
      if (lang && lang.match(/en|ja|vi|fr/)) {

        translate.use(lang);
      } else {
        lang = this.cache.getCache('lang');
        if (lang && lang.match(/en|ja|vi|fr/)) {

          translate.use(lang);
        } else {
          lang = translate.getBrowserLang();

          translate.use(lang.match(/en|ja|vi|fr/) ? lang : 'en');
        }
      }
    }
    translate.onLangChange.subscribe((event: LangChangeEvent) => {

      this.cache.setCache('lang', event.lang);
      this.cache.setCookie('lang', event.lang, '/', 356);
    });
  }

  publicPaths: any[] = [
    { path: '/ui/login', ignoreIfAuth: true },
    { path: '/ui/logout' },
    { path: '/ui/signup', ignoreIfAuth: true },
    { path: '/ui/forgot-passwd' },
    { path: '/ui/email/confirm' },
    { path: '/ui/reset/password' },
    { path: '/ui/resend-verify' },
    { path: '/ui/payments/payone/success' },
    { path: '/ui/payments/payone/cancel' },
  ];

  get startPaths() {
    return this.session.startPaths;
  }

  async ngOnInit() {
    console.log('Application initialize....')

    window.addEventListener('beforeunload', (event) => {
      console.log('reload Url', this.router.url)
      sessionStorage.setItem('__ReloadUrl', this.router.url);
    });

    console.log('ngOnInit loading page', this.router.url)
    let pubLink = this.publicPaths.find(p => this.utils.hasLink(p.path));
    console.log('ngOnInit pubLink', pubLink)

    let isAuthenticated = this.session.isAuthenticated;
    console.log('isAuthenticated?', (isAuthenticated ? 'Yes' : 'No'));

    this.userService.refreshToken().then((user: any) => {
      if (user && user.id) {
        console.log('go home!')
        this.userService.onAuthen.emit(user);
        // public link
        if (pubLink && !pubLink.ignoreIfAuth) {
          this.utils.redirectDetector(pubLink.path);
          return;
        }

        if (user.firstLoginAfterAdminReset) {
          this.router.navigate(['/ui/changepassword']);
          return;
        }

        for (let p of this.startPaths) {
          if (p.enable) {
            console.log('p.path', p.path)
            this.router.navigate([p.path]);
            return;
          }
        }
      } else {
        // public link
        if (pubLink) {
          this.utils.redirectDetector(pubLink.path);
          return;
        }
        this.router.navigate(['/ui/dashboard']);
      }
    }).catch((err) => {
      // public link
      if (pubLink) {
        this.utils.redirectDetector(pubLink.path);
        return;
      }
      this.router.navigate(['/ui/dashboard']);
    });
  }

  updateBootstraped(value: boolean) {
    //
  }
}
