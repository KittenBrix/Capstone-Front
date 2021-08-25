import { Component, OnInit } from '@angular/core';
import { Auth } from 'app/services/auth.service';

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
  constructor(public authService: Auth) {
    this._firstname = '';
    this._lastname = '';
    this._username = '';
    this._password = '';
    this._confirm = '';

  }

  ngOnInit(): void {

  }


  async submit(){
    console.log('submit');
    this.loading=true;
    try{

    }catch(err){

    }finally{
      this.loading = false;
    }
  }

}
