// TODO: change this to fit my needs instead of portal
import { Injectable } from '@angular/core';
import { User, UserPayload } from 'app/interfaces/API';


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
  private _user: User|null = null;

  constructor() {}

  loggedIn(): boolean {
    if (this.token !== '') {
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
    localStorage.setItem(this.tokenKey, value);
    this._token = value;
  }
  get token(): string{
    if (localStorage.getItem(this.tokenKey) && localStorage.getItem(this.tokenKey) !== '') {
      const expires: number = Number(localStorage.getItem(this.expiresKey));
      const seconds: number = Math.floor(new Date().getTime() / 1000);

      if (seconds >= expires) {
        this.logout();
      } else {
        this.token = localStorage.getItem(this.tokenKey)??'';
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
      this.expires = Number(localStorage.getItem(this.expiresKey));
    }
    return this.expires;
  }

  
  private setUser(user: User | null): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this._user = user;
  }


  get user(): any {
    if (localStorage.getItem(this.userKey)) {
      this._user = JSON.parse(localStorage.getItem(this.userKey)??'');
    }
    return this._user;
  }


  setAuth(user: User): void {
    this.login(user as UserPayload);
  }

  login(payload: UserPayload): void {
    this.expires = payload.expires;
    this.token = payload.jwt;
    this.refreshToken = payload.refreshToken;
    this.setRole(payload.role);
  }

  logout() {
    this.token = '';
    this.refreshToken = '';
    this.expires = 0;
    this.setUser(null);
    this.setRole(0);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.expiresKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.roleKey);
  }
}
