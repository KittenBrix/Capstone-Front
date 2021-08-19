import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  login:boolean = true;
  loading:boolean = false;
  _firstname: string;
  _lastname:string;
  _username:string;
  _password:string;
  _confirm:string;
  _error:string = "";
  constructor() {
    this._firstname = '';
    this._lastname = '';
    this._username = '';
    this._password = '';
    this._confirm = '';

  }

  ngOnInit(): void {

  }


  submit(){
    console.log('submit');
    setTimeout(()=>{
      this.loading = !this.loading;
    },1000);
    this.loading=true;
  }

}
