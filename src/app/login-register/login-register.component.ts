import { Component, OnInit } from '@angular/core';
import { Auth } from 'app/services/auth.service';
import { RestService } from 'app/services/rest.service';
import { environment } from 'environments/environment';

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
  constructor(public authService: Auth,
    public restService: RestService) {
    this._firstname = '';
    this._lastname = '';
    this._username = '';
    this._password = '';
    this._confirm = '';

  }

  ngOnInit(): void {

  }


  async submit(){
    this._error = '';
    this.loading=true;
    try{
      let data: any = null;
      if (this.login){
        // this means we want to login.
        const _login = await this.restService.req('post',`${environment.apiUrl}/auth`,{username: this._username, password: this._password});
        data = _login;
      } else {
        // registration instead
        // {username, firstname, lastname, password}
        const reg = await this.restService.req('post',`${environment.apiUrl}/auth/register`,{
          username: this._username, password: this._password, firstname: this._firstname, lastname: this._lastname});
        data = reg;
      }
      console.log(data);
      if (data && data.token){
        this.authService.setAuth(data);
      } else {
        this._error = data.msg ?? JSON.stringify(data);
      }
    }catch(err){
      console.log(err);
    }finally{
      this.loading = false;
    }
  }

}
