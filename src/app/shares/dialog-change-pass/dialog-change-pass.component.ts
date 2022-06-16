import { Component, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from "ngx-toastr";
import { AppUtilsService } from '../../service';
import { UserSessionService } from '../../service';
import { HttpConnectorService } from '../../service';

import { CONSUME_API } from '../../service'
import { UserProfile } from 'src/app/models';

interface IChangePass { password: string; newPassword: string; userId: string }

@Component({
  selector: 'dialog-change-pass',
  templateUrl: './dialog-change-pass.component.html',
  styleUrls: ['./dialog-change-pass.component.scss']
})
export class DialogChangePassComponent {


  constructor(
    protected modalService: BsModalService,
    protected toastr: ToastrService,
    private utils: AppUtilsService,
    public session: UserSessionService,
    private xhr: HttpConnectorService,
  ) { }

  @ViewChild('content') private content: any

  @Input() title = ''
  user: UserProfile
  @Output() reset = new EventEmitter<any>()

  closeResult: string
  refModal: any
  payload: IChangePass = {} as IChangePass;
  retypPass = '';

  changePass() {
    if (!this.checkValid()) {
      return;
    }
    this.payload.userId = this.user.id || this.session.userId
    this.xhr.post(CONSUME_API.AUTH_USERS.changePass, this.payload).subscribe(res => {
      this.refModal.hide();
      this.toastr.success('The password is changed successfully');
    }, err => {

      if (err && (err.status === 403 || (err.error && err.error.error && err.error.error.statusCode === 403))) {
        this.toastr.warning('Permission Denied');
        return;
      }
      else if (err && err.status >= 400) {
        this.toastr.error(err);
        return;
      }

      this.toastr.error('Some thing went wrong, please try again later', err);
      return;
    })
  }

  open(user?: UserProfile) {
    if (user) this.user = user
    this.refModal = this.modalService.show(this.content);
  }

  private checkValid() {
    if (!this.payload.password) {
      this.toastr.warning('Current password cannot be empty');
      return false;
    }
    if (!this.payload.newPassword || this.payload.newPassword.trim().length < 4) {
      this.toastr.warning('Password must be at lease 4 characters');
      return false;
    }
    if (!this.retypPass) {
      this.toastr.warning('Retype password cannot be empty');
      return false;
    }
    if (this.payload.newPassword !== this.retypPass) {
      this.toastr.warning('Retype password not match with new password');
      return false;
    }
    return true;
  }
}
