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

@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    FooterComponent,
    HeaderComponent,
    P404Component,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    Auth,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
