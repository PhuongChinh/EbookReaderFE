import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser'

import { Router, ActivatedRoute } from "@angular/router"
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors, AbstractControl, EmailValidator } from '@angular/forms'

import { ToastrService } from "ngx-toastr";
import {
  UserSessionService,
  AppUtilsService,
  HttpConnectorService,
  AppStateService,
  AppCacheService,
  UserServiceService,
} from '../../service'

import { CONSUME_API } from '../../service'

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(protected pageTitle: Title,
    protected toastr: ToastrService,
    public state: AppStateService, public cache: AppCacheService, public session: UserSessionService,
    protected xhr: HttpConnectorService, protected router: Router, protected route: ActivatedRoute,
    protected utils: AppUtilsService,
    protected userService: UserServiceService) {
    this.pageTitle.setTitle('SDB | Forgot Password')
  }

  formGroup: any = null

  formGroup2: any = null

  routeSub: any = undefined

  message: any = {}

  token: string = undefined
  uid: string = undefined

  ngOnInit() {
    this.routeSub = this.route.queryParams.subscribe((params) => {

      this.token = params.token;
      this.uid = params.uid;
    });

    this.formGroup = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ])
    }, { updateOn: 'blur' })

    this.formGroup2 = new FormGroup({
      yourPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(128)
      ]),
      retypePassword: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(128)
      ])
    }, { updateOn: 'blur' })

  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  onSubmit() {
    let g = this.formGroup;

    if (g.invalid) {
      this.utils.markAsTouched(g);
    }
    // retry checking
    if (g.invalid) {

      return;
    }
    let val = g.value


    this.message = {};

    //
    this.xhr.post(CONSUME_API.PUBLIC_USERS.resetPassword, val).subscribe((resp: any) => {



      if (!resp) {
        this.message.somethingWrong = ('Something went wrong, please try again!');
        return;
      }
      this.message.pleaseCheckMailbox = 'Please check your mail box and click on link to reset your credentials!';
      // this.toastr.warning(this.message.pleaseCheckMailbox);

      //this.router.navigate(['/ui/landing'])
    }, (err) => {

      if (err && err.error && err.error.statusCode === 401) {
        // this.toastr.warning('Invalid credentials, please try again', 'Error')

        return
      }
      this.utils._$focus('email')
      this.message.serverMessage = this.utils._getMessage(err)
    });
  }

  goHome() {
    this.router.navigate(['/ui/landing'])
  }

  onSubmit2() {
    let g = this.formGroup2;

    if (g.invalid) {
      this.utils.markAsTouched(g);
    }
    this.message = {};
    // retry checking
    if (g.invalid) {

      return;
    }
    let val = g.value

    if (val.yourPassword != val.retypePassword) {
      this.message.passwordNotMatched = ('Your Password and Retype Password are not matched. Please try again');
      return;
    }

    val.token = this.token;
    val.uid = this.uid;





    //
    this.xhr.post(CONSUME_API.PUBLIC_USERS.resetPassword, val).subscribe((resp: any) => {


      if (!resp) {
        this.message.somethingWrong = ('Something went wrong, please try again!');
        return;
      }
      this.message.success = 'Successfully to reset your password, please log into the system to continue your work!';
      // this.toastr.success(this.message.success);

    }, (err) => {

      this.message.serverMessage = this.utils._getMessage(err)
    });
  }

  onGSignIn() {
    // this.authService.signInWithGoogle().then((resp) => {
    //   this._next(resp);
    // });
  }
  onFSignIn() {
    // this.authService.signInWithFB().then((resp) => {
    //   this._next(resp);
    // });
  }
  _next(resp) {

    if (!resp) {
      this.message.somethingWrong = ('Something went wrong, please try again!');
      return;
    }
    this.userService.onAuthen.emit(resp)
    this.router.navigate(['/ui/home']);
  }
}

