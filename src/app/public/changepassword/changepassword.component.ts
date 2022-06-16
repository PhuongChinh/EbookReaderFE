import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppCacheService, AppStateService, AppUtilsService, HttpConnectorService, UserServiceService, UserSessionService } from 'src/app/service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  formGroup: FormGroup;
  constructor(protected pageTitle: Title,
    public state: AppStateService,
    public cache: AppCacheService,
    public session: UserSessionService,
    protected xhr: HttpConnectorService,
    protected toastr: ToastrService,
    protected router: Router,
    protected utils: AppUtilsService,
    private fb: FormBuilder,
    protected userService: UserServiceService) {
    this.pageTitle.setTitle('SDB | ChangPassword')
  }
  get accessHomepage(): boolean {
    return (this.session.isAdmin || this.session.isManager || this.session.isTeacher)
  }
  get invalid(): boolean {
    if (this.formGroup && this.formGroup.valid) {
      return false;
    }
    return true;
  }
  ngOnInit() {
    this.formGroup = this.fb.group({
      password: [''],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$%\^&]).{8,}$')]],
      confirm_password: ['', [Validators.required]],
      userId: this.session.user.id,
    },
      {
        validator: this.MustMatch('newPassword', 'confirm_password')
      }
    );
  }
  passType = 'password';
  changePasswordType() {
    if (this.passType === 'password') {
      this.passType = 'text';
    } else {
      this.passType = 'password';
    }
  }
  changePassword() {
    let npass = this.formGroup.get('newPassword').value;
    let cpass = this.formGroup.get('confirm_password').value;
    if ('' == npass) {
      this.toastr.warning('Bạn phải nhập mật khẩu mới khác với mật khẩu mà SCM cung cấp!');
      return;
    }

    if (npass == cpass) {
      // this.userprofileservice.postPass(this.formGroup.value).subscribe(res => {
      //   this.toastr.success('bạn đã cập nhật mật khẩu thành công');
      //   this.userService.logoutUser();
      //   this.session.clearSession()
      //   this.router.navigate(['/ui/login'])
      // })
    }
    else {
      this.toastr.warning('nhập lại mật khẩu');
    }


  }
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  backLogin() {
    this.userService.logoutUser();
    this.session.clearSession()
    this.router.navigate(['/ui/login'])
  }

}
