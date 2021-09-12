// TODO: change this to fit my needs instead of portal.
import { Injectable } from '@angular/core';
import { Auth } from './auth.service';

@Injectable()
export class JWTService {
  constructor(private readonly auth: Auth) {}

  /**
   * Checks to see if they have a valid auth token
   * @returns {boolean}
   */
  checkToken(): string {
    if (this.auth.token) {
      return this.auth.token;
    } else {
      return '';
    }
  }
  /**
   * Checks to see if the user meets the minimum role requirement
   * @param  {number}  minRole
   * @return {boolean}
   */
  checkRole(minRole:number): boolean {
    if (this.auth.siteRole >= minRole) {
      return true;
    } else {
      return false;
    }
  }

  getRole(role: number): boolean {
    if (this.auth.siteRole === role) {
      return true;
    } else {
      return false;
    }
  }
}
