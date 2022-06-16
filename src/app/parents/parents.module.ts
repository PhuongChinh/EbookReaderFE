import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';
import { SharesModule } from '../shares/shares.module';
import { MainComponent } from './main/main.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'ui/parents', component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
    ]
  },
]


@NgModule({
  declarations: [MainComponent, HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharesModule.forRoot(),
  ]
})
export class ParentsModule { }
