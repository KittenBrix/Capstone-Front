import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './home/settings/settings.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { P404Component } from './p404/p404.component';
import { PracticeComponent } from './practice/practice.component';
import { WeeklytimeviewComponent } from './weeklytimeview/weeklytimeview.component';
import { LoggedInGuard } from './auth.guard';

const routes: Routes = [
  {path: 'access', component: LoginRegisterComponent},
  {path: 'practice', component: PracticeComponent},
  {path: 'settings', component: SettingsComponent},
  {path: 'week', component: WeeklytimeviewComponent},
  {path: 'home', component: HomeComponent, canActivate: [LoggedInGuard]},
  {path: '**', component: P404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
