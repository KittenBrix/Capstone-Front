import { Component, OnInit } from '@angular/core';
import { Auth } from 'app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // TODO restructure html to use mat-menu instead of bootstrap dropdown.
  constructor(private authService: Auth) {

  }

  ngOnInit(): void {

  }

  roleId(){
    return this.authService.siteRole;
  }

  loggedIn(){
    return this.authService.loggedIn();
  }

  search(event:any){
    console.log(event.target.value);
    event.target.value = '';
  }

  logout(){
    this.authService.logout();
    console.log("logged out");
  }
}
