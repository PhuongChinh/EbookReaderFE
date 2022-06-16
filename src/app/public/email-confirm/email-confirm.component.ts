import { Component, OnInit } from '@angular/core';

import { Title } from '@angular/platform-browser'

import { Router, ActivatedRoute } from "@angular/router"
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors, AbstractControl, EmailValidator } from '@angular/forms'

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
  selector: 'app-email-confirm',
  templateUrl: './email-confirm.component.html',
  styleUrls: ['./email-confirm.component.scss']
})
export class EmailConfirmComponent implements OnInit {

  constructor(protected pageTitle: Title, public state: AppStateService, public cache: AppCacheService, public session: UserSessionService,
    protected xhr: HttpConnectorService, protected router: Router, protected route: ActivatedRoute,
    protected utils: AppUtilsService,
    protected userService: UserServiceService) {
    this.pageTitle.setTitle('SDB | Email Confirm')
  }

  formGroup: any = null

  isShowForm = false
  isResend = false

  routeSubVerify: any = undefined
  routeSubResend: any = null;

  message: any = {}

  ngOnInit() {
    this.routeSubVerify = this.route.queryParams.subscribe((params) => {

      this.isResend = false;
      if (params.uid && params.token) {
        this.verify(params)
      } else {
        this.isShowForm = true;
      }
    });

    this.routeSubResend = this.route.params.subscribe((params) => {

      if (params.email) {
        this.isShowForm = true;
        this.isResend = true;
        this.resend(params);
        this.formGroup = new FormGroup({
          email: new FormControl(params.email, [
            Validators.required,
            Validators.email
          ])
        }, { updateOn: 'blur' })
      } else {
        this.formGroup = new FormGroup({
          email: new FormControl('', [
            Validators.required,
            Validators.email
          ])
        }, { updateOn: 'blur' })
      }
    });

  }

  ngOnDestroy() {
    this.routeSubVerify.unsubscribe();
    this.routeSubResend.unsubscribe();
  }

  verify(params) {
    this.isShowForm = false;
    this.xhr.post(CONSUME_API.PUBLIC_USERS.setPassword, params).subscribe((resp: any) => {
      //

    }, (err) => {
      this.isShowForm = true;

    });
  }

  onSubmit() {

    if (this.formGroup.invalid) {
      this.utils.markAsTouched(this.formGroup);
    }
    // retry checking
    if (this.formGroup.invalid) {

      this.message.requiredFields = 'Please correct the invalid fields or fill in for any required fields';
      return;
    }
    let val = this.formGroup.value
    this.resend(val);
  }

  resend(val: any) {

    //
    this.xhr.post(CONSUME_API.PUBLIC_USERS.resetPassword, val).subscribe((resp: any) => {

      if (!resp) {
        this.message.somethingWrong = ('Something went wrong, please try again!');
        return;
      }
      this.message.successMessage = "An email with verification link had been sent to your email. Plz check your mail box!"
    }, (err) => {
      this.message.serverMessage = this.utils._getMessage(err)
    });
  }
}