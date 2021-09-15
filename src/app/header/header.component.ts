import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from 'app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // TODO restructure html to use mat-menu instead of bootstrap dropdown.
  constructor(private authService: Auth,
    public router: Router) {
  }

  ngOnInit(){
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
    // this.router.navigate['/access'];
    console.log("logged out");
  }

  getName(){
    return (this.authService.user) ? this.authService.user.username : '';
  }
}
