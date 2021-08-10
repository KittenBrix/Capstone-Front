import { Component, OnInit } from '@angular/core';
import { Auth } from 'app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private authService: Auth) {

  }

  ngOnInit(): void {

  }

  roleId(){
    return this.authService.getRole();
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
