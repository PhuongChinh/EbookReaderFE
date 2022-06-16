import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule, DatePipe } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { TranslateModule, } from "@ngx-translate/core";
import { HttpClientModule, } from "@angular/common/http";

import { ToastrModule } from "ngx-toastr";

import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PopoverModule, PopoverConfig } from "ngx-bootstrap/popover";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
import { CollapseModule } from "ngx-bootstrap/collapse";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

import { CustomPopoverConfig } from "../globals";
import {
  SafePipe,
  LinkPipe,
  ShortenPipe,
  ShortenIDPipe,
  SortingPipe,
  CapNamePipe,
  LocalDatePipe,
  QrcodeStatusPipe,
  CurrencyPipe,
  MapPipe,
  MenuSubDirective,
  MenuHasSubDirective,
  DragDropDirective,
} from "../pipe";

import { NavbarComponent } from "./navbar/navbar.component";
import { AvatarUpdateComponent } from "./avatar-update/avatar-update.component";
import { PasswordUpdateComponent } from "./password-update/password-update.component";

import { DialogSettingRoleComponent } from "../shares/dialog-setting-role/dialog-setting-role.component";
import { DialogChangePassComponent } from "./dialog-change-pass/dialog-change-pass.component";
import { DialogDelComponent } from "./dialog-del/dialog-del.component";
import { DialogConfirmComponent } from "./dialog-confirm/dialog-confirm.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

const routes: Routes = [];

@NgModule({
  declarations: [
    SafePipe,
    LinkPipe,
    CurrencyPipe,
    LocalDatePipe,
    QrcodeStatusPipe,
    ShortenPipe,
    ShortenIDPipe,
    CapNamePipe,
    SortingPipe,
    MapPipe,
    MenuSubDirective,
    DragDropDirective,
    MenuHasSubDirective,
    NavbarComponent,
    SidebarComponent,
    DialogSettingRoleComponent,
    DialogChangePassComponent,
    DialogDelComponent,
    DialogConfirmComponent,
    AvatarUpdateComponent,
    PasswordUpdateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    TranslateModule,
    TabsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
    BsDropdownModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 6000,
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
    }),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    InfiniteScrollModule
  ],
  providers: [{ provide: PopoverConfig, useFactory: CustomPopoverConfig }],
  exports: [
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    BsDatepickerModule,
    TranslateModule,
    PopoverModule,
    ToastrModule,
    TabsModule,
    CollapseModule,
    BsDropdownModule,
    DatePipe,
    SafePipe,
    LinkPipe,
    CurrencyPipe,
    DragDropDirective,
    LocalDatePipe,
    QrcodeStatusPipe,
    ShortenPipe,
    ShortenIDPipe,
    CapNamePipe,
    SortingPipe,
    MapPipe,
    MenuSubDirective,
    MenuHasSubDirective,
    NavbarComponent,
    SidebarComponent,
    DialogSettingRoleComponent,
    DialogChangePassComponent,
    DialogDelComponent,
    DialogConfirmComponent,
    AvatarUpdateComponent,
    PasswordUpdateComponent,
    InfiniteScrollModule
  ],
})
export class SharesModule {
  static forRoot() {
    // pattern for adding app-wide services
    return {
      ngModule: SharesModule,
      providers: [{ provide: PopoverConfig, useFactory: CustomPopoverConfig }],
    };
  }
}
