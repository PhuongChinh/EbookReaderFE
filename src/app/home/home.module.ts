import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharesModule } from '../shares/shares.module';
import { DaskboardComponent } from './daskboard/daskboard.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: 'ui/dashboard', redirectTo: 'ui/dashboard', pathMatch: 'full' },
  {
    path: 'ui', component: MainComponent,
    children: [
      { path: 'dashboard', component: DaskboardComponent },
    ]
  },
]

@NgModule({
  declarations: [
    DaskboardComponent,
    MainComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharesModule.forRoot(),

  ],
  providers: [
  ]
})
export class HomeModule { }
