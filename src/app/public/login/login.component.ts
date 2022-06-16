import { Component, OnInit, Output, EventEmitter } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { Router } from "@angular/router"
import { FormGroup, FormControl, Validators, EmailValidator } from '@angular/forms'

import {
  UserSessionService,
  AppUtilsService,
  HttpConnectorService,
  AppStateService,
  AppCacheService,
  UserServiceService,
} from '../../service'
import { ToastrService } from 'ngx-toastr'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //@Output() authenticated = new EventEmitter<any>()

  formGroup: FormGroup;

  message: any = {};
  nextUrl: string;
  lang
  constructor(protected pageTitle: Title,
    public state: AppStateService,
    public translate: TranslateService,
    public cache: AppCacheService,
    public session: UserSessionService,
    protected xhr: HttpConnectorService,
    protected toastr: ToastrService,
    protected router: Router,
    protected utils: AppUtilsService,
    protected userService: UserServiceService) {
    this.pageTitle.setTitle('SDB | Login')
  }
  get langs(): string {
    return this.lang = this.translate.currentLang;
  }
  get urlHome(): string {
    if (this.langs == "vi") {
      return "/#contact"
    }
    return "/" + this.langs + "/#contact"
  }

  get startPaths() {
    return this.session.startPaths;
  }

  ngOnInit() {
    this.lang = this.translate.currentLang;
    this.formGroup = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(128)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(128)
      ])
    }, { updateOn: 'blur' });

    setTimeout(() => {
      this.utils._$focus('email')
    }, 1000)
  }

  get invalid(): boolean {
    if (this.formGroup && this.formGroup.valid) {
      return false;
    }
    return true;
  }
  passType = 'password';
  changePasswordType() {
    if (this.passType === 'password') {
      this.passType = 'text';
    } else {
      this.passType = 'password';
    }
  }
  onSubmit() {
    this.userService.loginUser(this.formGroup.value).then((user: any) => {
      if (user && user.id) {
        console.log('go home!')
        this.userService.onAuthen.emit(user);

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
        this.message.somethingWrong = ('Something went wrong, please try again!');
      }
    }).catch(err => {
      if (err && err.error && err.error.error == 'EMAIL_NOT_VERIFIED') {
        this.message.emailNotVerifiedMessage = 'EMAIL_NOT_VERIFIED'
      } else if (err && err.error && err.error.error == 'Unauthorized') {
        this.message.badCredentialsMessage = 'INVALID_CREDENTIALS'
      } else {
        if (this.formGroup.value.email == "" || this.formGroup.value.password == "") {
          this.message.serverMessage = "Please fill in login information";
        }
        else {
          this.message.serverMessage = this.utils._getMessage(err);
        }
      }
    })
  }
}
