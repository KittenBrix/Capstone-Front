// TODO: change this to fit my needs instead of portal
import { Injectable } from '@angular/core';
import { User, UserPayload } from 'app/interfaces/API';


@Injectable()
export class Auth {
  protected readonly tokenKey: string = '_keys_t20';
  protected readonly roleKey: string = '_keys_r20';
  protected readonly refreshKey: string = '_keys_rt20';
  protected readonly expiresKey: string = '_keys_e20';
  protected readonly userKey: string = '_keys_u20';

  public token: string = '';
  public role: number = -1;
  public refresh: string= '';
  public expires: number = -1;
  public user: User|null = null;

  constructor() {}

  loggedIn(): boolean {
    if (this.getToken() !== '') {
      return true;
    } else {
      return false;
    }
  }

  setRole(role: number): void {
    localStorage.setItem(this.roleKey, String(role));
    this.role = role;
  }

  getRole(): number {
    if (localStorage.getItem(this.roleKey) && localStorage.getItem(this.roleKey) !== '') {
      this.setRole(Number(localStorage.getItem(this.roleKey)));
    }
    return this.role;
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.token = token;
  }

  getToken(): string {
    if (localStorage.getItem(this.tokenKey) && localStorage.getItem(this.tokenKey) !== '') {
      const expires: number = Number(localStorage.getItem(this.expiresKey));
      const seconds: number = Math.floor(new Date().getTime() / 1000);

      if (seconds >= expires) {
        this.logout();
      } else {
        this.setToken(localStorage.getItem(this.tokenKey)??'');
      }
    } else {
      return '';
    }

    return this.token;
  }

  setRefreshToken(refresh: string): void {
    localStorage.setItem(this.refreshKey, refresh);
    this.refresh = refresh;
  }

  getRefreshToken(): string {
    if (localStorage.getItem(this.refreshKey) && localStorage.getItem(this.refreshKey) !== '') {
      this.setRefreshToken(localStorage.getItem(this.refreshKey)??'');
    }

    return this.refresh;
  }

  hasRefreshToken(): boolean {
    if (localStorage.getItem(this.refreshKey) && localStorage.getItem(this.refreshKey) !== '') {
      return true;
    }
    return false;
  }

  setExpires(expires: number): void {
    localStorage.setItem(this.expiresKey, String(expires));
    this.expires = expires;
  }

  getExpires(): number {
    if (localStorage.getItem(this.expiresKey) && localStorage.getItem(this.expiresKey) !== '') {
      this.setExpires(Number(localStorage.getItem(this.expiresKey)));
    }

    return this.expires;
  }

  setUser(user: User | null): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.user = user;
  }

  getUser(): any {
    if (localStorage.getItem(this.userKey)) {
      this.user = JSON.parse(localStorage.getItem(this.userKey)??'');
    }

    return this.user;
  }


  setAuth(user: User): void {
    //{ partnerID: number; expires: any; jwt: any; refreshToken: any; role: any; partnerData: any }
    this.login(user as UserPayload);
  }

  login(payload: UserPayload): void {
    this.setExpires(payload.expires);
    this.setToken(payload.jwt);
    this.setRefreshToken(payload.refreshToken);
    this.setRole(payload.role);
  }

  logout() {
    this.setToken('');
    this.setRefreshToken('');
    this.setExpires(0);
    this.setUser(null);
    this.setRole(0);

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshKey);
    localStorage.removeItem(this.expiresKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.roleKey);
  }
}
