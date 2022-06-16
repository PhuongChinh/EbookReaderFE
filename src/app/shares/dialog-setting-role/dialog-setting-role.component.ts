import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from "ngx-toastr";
import { AppStateService } from '../../service'
import { AppUtilsService } from '../../service';
import { UserSessionService } from '../../service';
import { HttpConnectorService } from '../../service';
import { CONSUME_API } from '../../service'

@Component({
  selector: 'dialog-setting-role',
  templateUrl: './dialog-setting-role.component.html',
  styleUrls: ['./dialog-setting-role.component.scss']
})
export class DialogSettingRoleComponent implements OnInit {

  @Input() title: string = 'Role Settings'
  @Input() set item(item: any) {
    if (item) {
      this._user = item
    }
  }

  roles: any[] = [];

  get item(): any {
    return this._user
  }

  @ViewChild('content') private content: any

  @Output() agree = new EventEmitter<any>()

  closeResult: string
  refModal: any
  _user: any = {}

  constructor(
    public state: AppStateService,
    protected modalService: BsModalService,
    protected toastr: ToastrService,
    private utils: AppUtilsService,
    public session: UserSessionService,
    private xhr: HttpConnectorService,
  ) { }

  ngOnInit() {
    this.roles = JSON.parse(JSON.stringify(this.state.roles));
  }

  agreeEvent() {

    this.save();
  }

  onSelected(role: any) {
    this.roles.map(r => {
      if (r.value == role.value) {
        r.isSelected = true;
      } else {
        r.isSelected = false;
      }
    });
  }

  get selectedRoles() {
    return this.roles.filter(r => r.isSelected);
  }

  get isNoChange(): boolean {
    let selected = this.selectedRoles;
    let curr = this.item.roles;
    for (let i = 0; i < selected.length; i++) {
      let r = selected[i];
      let f = curr.find(r2 => r2.value == r.value);
      if (!f) {
        return false;
      }
    }
    return true;
  }

  open() {
    this.roles = JSON.parse(JSON.stringify(this.state.roles));
    setTimeout(() => {
      if (this.item && this.item.roles) {
        this.roles.map(r => {
          for (let r2 of this.item.roles) {
            if (r.value == r2.value) {
              r.isSelected = true;
            }
          }
        })
      }
    }, 1000)
    this.refModal = this.modalService.show(this.content, { 'class': 'large' });
  }

  get userRole() {
    if (this.item && this.item.roles && this.item.roles.length > 0) {
      return this.item.roles[0];
    }
    return {};
  }

  save() {
    if (this.session.userId == this.item.id) {
      this.toastr.warning('Can not change your self')
      this.refModal.hide()
      return;
    }
    if (this.isNoChange) {

      this.refModal.hide()
      return;
    }
    let selected = this.selectedRoles;
    let promisses = [];
    selected.map(r => {
      promisses.push(this._saveRole({ 'userId': this.item.id, 'newRole': r.value || '', 'curRole': this.userRole.value || '' }))
    })
    Promise.all(promisses)
      .then((result) => {

        this.agree.emit(result);
        this.refModal.hide()
      })
  }

  _saveRole(param: any): any {
    return this.xhr._reqPromise('post', CONSUME_API.AUTH_USERS.changeRole, param);
  }
}
