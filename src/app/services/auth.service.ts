import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable()
export class Auth {
  protected readonly tokenKey: string = '_keys_t20';
  protected readonly siteRoleKey: string = '_keys_sr20';
  protected readonly roleKey: string = '_keys_r20';
  protected readonly refreshKey: string = '_keys_rt20';
  protected readonly expiresKey: string = '_keys_e20';
  protected readonly userKey: string = '_keys_u20';

  private _token: string = '';
  private _siteRole: number = -1;
  private _refresh: string= '';
  private _expires: number = -1;
  private _user: any = null;

  constructor(private router: Router) {}

  loggedIn(): boolean {
    // check if we're logged in, forcing redirection in case we are/aren't.
    if (this.token != '') {
      return true;
    } else {
      return false;
    }
    
  }

  // setter is private.
  private setRole(role: number): void {
    localStorage.setItem(this.roleKey, String(role));
    this._siteRole = role;
  }

  get siteRole(): number {
    if (localStorage.getItem(this.roleKey) && localStorage.getItem(this.roleKey) !== '') {
      this.setRole(Number(localStorage.getItem(this.roleKey)));
    }
    return this._siteRole;
  }

  set token(value:string) {
    const item = value ?? '';
    if (value == ''){
      throw new Error("set to bad item");
    }
    localStorage.setItem(this.tokenKey, value ?? '');
    this._token = value;
  }
  get token(): string{
    const tokenvalue = localStorage.getItem(this.tokenKey);
    if (tokenvalue && tokenvalue != '') {
      const expires: number = Number(localStorage.getItem(this.expiresKey));
      const seconds: number = Math.floor(new Date().getTime() / 1000);

      if (seconds >= expires) {
        this.logout();
      } else {
        this._token = tokenvalue ?? '';
      }
    } else {
      return '';
    }
    return this._token;
  }

  set refreshToken(refresh:string){
    localStorage.setItem(this.refreshKey, refresh);
    this._refresh = refresh;
  }
  get refreshToken():string{
    if (localStorage.getItem(this.refreshKey) && localStorage.getItem(this.refreshKey) !== '') {
      this.refreshToken = localStorage.getItem(this.refreshKey)??'';
    }
    return this._refresh;
  }

  hasRefreshToken(): boolean {
    const data = localStorage.getItem(this.refreshKey);
    if (data && data !== '') {
      return true;
    }
    return false;
  }

  set expires (exp: number){
    localStorage.setItem(this.expiresKey, String(exp));
    this._expires = exp;
  }

  get expires(): number {
    if (localStorage.getItem(this.expiresKey) && localStorage.getItem(this.expiresKey) !== '') {
      this._expires = Number(localStorage.getItem(this.expiresKey));
    }
    return this._expires;
  }

  
  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this._user = user;
  }

  get user(): any {
    if (localStorage.getItem(this.userKey)) {
      this._user = JSON.parse(localStorage.getItem(this.userKey)??'');
    }
    return this._user;
  }


  login(token: any): void {
    const payload: any = jwt_decode(token);
    this.expires = Number(payload.exp);
    this.token = payload.token ?? token;
    this.setRole(payload.role);
    this.setUser(payload);
  }

  logout() {
    this._token = '';
    this.refreshToken = '';
    this.expires = 0;
    this.setUser(null);
    this.setRole(0);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.expiresKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.roleKey);
    this.router.navigate(['/access']);
  }

  canAccess(url?:any){
    if (url && url.includes('access')){
      if (!this.loggedIn()){
        return true;
      } else {
        return false;
      }
    } else {
      if (this.loggedIn()){
        return true;
      } else {
        return false;
      }
    }
  }
}

