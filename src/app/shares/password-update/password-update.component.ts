import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { UserSessionService } from 'src/app/service';
import { Location } from "@angular/common";
import { TranslateService } from '@ngx-translate/core';
import { MustMatch } from '../must-match.validator';

@Component({
  selector: 'app-password-update',
  templateUrl: './password-update.component.html',
  styleUrls: ['./password-update.component.scss']
})
export class PasswordUpdateComponent implements OnInit {

  changpass: FormGroup;
  password: FormControl;
  newPassword: FormControl;
  confirm_password: FormControl;
  refModal: BsModalRef;
  lang;
  constructor(private toastr: ToastrService,
    private fb: FormBuilder,
    private userSesion: UserSessionService,
    private router: Router,
    private location: Location,
    public translate: TranslateService,

  ) { }
  ngOnInit() {
    this.lang = this.translate.currentLang;
    this.changpass = this.fb.group({
      password: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$%\^&]).{8,}$')]],
      confirm_password: ['', [Validators.required]],
      userId: this.userSesion.user.id,
    }, {
      validator: MustMatch('newPassword', 'confirm_password')
    });
  }

  wrongPassword: boolean;
  onSubmit() {
    this.wrongPassword = true;

  }

  changePassword() {
    let npass = this.changpass.get('newPassword').value;
    let cpass = this.changpass.get('confirm_password').value;
    if (npass == cpass) {
      // this.userprofileservice.postPass(this.changpass.value).subscribe(res => {
      //   this.translate.get('changePass.updateSuccess').subscribe((msg: string) => {
      //     this.toastr.success(msg);
      //   });
      // })
      this.wrongPassword = false;
      this.router.navigate(["/ui/login"]);
    }
    else {
      this.toastr.warning('Enter password');
    }
    this.changpass.reset();
  }
  close() {
    this.changpass.reset();
  }
  get invalid(): boolean {
    if (this.changpass && this.changpass.valid) {
      return false;
    }
    return true;
  }
}
