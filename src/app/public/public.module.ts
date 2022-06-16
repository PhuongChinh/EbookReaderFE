import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharesModule } from '../shares/shares.module'

import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EmailConfirmComponent } from './email-confirm/email-confirm.component';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';

const routes: Routes = [
  { path: '', redirectTo: 'ui/landing', pathMatch: 'full' },
  {
    path: 'ui', component: MainComponent,
    children: [
      { path: 'landing', component: LoginComponent },
      { path: 'login', component: LoginComponent },
      { path: 'forgot-passwd', component: ForgotPasswordComponent },
      { path: 'reset/password', component: ForgotPasswordComponent },
      { path: 'email/confirm', component: EmailConfirmComponent },
      { path: 'resend-verify/:email', component: EmailConfirmComponent },
      { path: 'changepassword', component: ChangepasswordComponent },
    ]
  },
]

@NgModule({
  declarations: [
    ForgotPasswordComponent,
    EmailConfirmComponent,
    LoginComponent,
    MainComponent,
    ChangepasswordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharesModule.forRoot()
  ],
  providers: []
})
export class PublicModule { }
