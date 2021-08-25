import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './home/settings/settings.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { P404Component } from './p404/p404.component';
import { PracticeComponent } from './practice/practice.component';

const routes: Routes = [
  {path: 'access', component: LoginRegisterComponent},
  {path: 'practice', component: PracticeComponent},
  {path: 'settings', component: SettingsComponent},
  {path: '', component: HomeComponent},
  {path: '**', component: P404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
