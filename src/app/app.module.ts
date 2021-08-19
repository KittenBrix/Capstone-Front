import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { CertsComponent } from './assignments/certs/certs.component';
import { HomeworkComponent } from './assignments/homework/homework.component';
import { FreecodecampComponent } from './assignments/freecodecamp/freecodecamp.component';
import { ViewComponent } from './cohort/view/view.component';
import { PeopleComponent } from './cohort/people/people.component';
import { SchedulerComponent } from './cohort/scheduler/scheduler.component';
import { AttendanceComponent } from './cohort/attendance/attendance.component';
import { RecordingsComponent } from './cohort/recordings/recordings.component';
import { GoogleclassroomComponent } from './cohort/googleclassroom/googleclassroom.component';
import { DataListComponent } from './util/data-list/data-list.component';
import { DataEntryComponent } from './util/data-entry/data-entry.component';
import { RolesComponent } from './home/settings/roles/roles.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';




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
    CertsComponent,
    HomeworkComponent,
    FreecodecampComponent,
    ViewComponent,
    PeopleComponent,
    SchedulerComponent,
    AttendanceComponent,
    RecordingsComponent,
    GoogleclassroomComponent,
    DataListComponent,
    DataEntryComponent,
    RolesComponent,
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
  ],
  providers: [
    Auth,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
