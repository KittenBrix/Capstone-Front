import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { P404Component } from './p404/p404.component';
import { HomeComponent } from './home/home.component';
import { Auth } from './services/auth.service';
import { FormsModule } from '@angular/forms';
import { PracticeComponent } from './practice/practice.component';
import { SettingsComponent } from './home/settings/settings.component';
import { AssignmentsComponent } from './assignments/assignments.component';
import { ViewComponent } from './cohort/view/view.component';
import { PeopleComponent } from './cohort/people/people.component';
import { SchedulerComponent } from './cohort/scheduler/scheduler.component';
import { AttendanceComponent } from './cohort/attendance/attendance.component';
import { DataListComponent } from './util/data-list/data-list.component';
import { DataEntryComponent } from './util/data-entry/data-entry.component';
import { RolesComponent } from './home/settings/roles/roles.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { CohortNavigatorComponent } from './cohort-navigator/cohort-navigator.component';
import { RestService } from './services/rest.service';
import { WeeklytimeviewComponent } from './weeklytimeview/weeklytimeview.component';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { JWTService } from './services/jwt.service';
import { LoggedInGuard } from './auth.guard';
import { CategoryViewComponent } from './assignments/category-view/category-view.component';
import { SubmissionViewComponent } from './assignments/submission-view/submission-view.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    FooterComponent,
    HeaderComponent,
    P404Component,
    HomeComponent,
    PracticeComponent,
    SettingsComponent,
    AssignmentsComponent,
    ViewComponent,
    PeopleComponent,
    SchedulerComponent,
    AttendanceComponent,
    DataListComponent,
    DataEntryComponent,
    RolesComponent,
    CohortNavigatorComponent,
    WeeklytimeviewComponent,
    CategoryViewComponent,
    SubmissionViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
    HttpClientModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  providers: [
    Auth,
    RestService,
    JWTService,
    LoggedInGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
