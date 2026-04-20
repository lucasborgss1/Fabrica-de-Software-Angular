import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly isLoggedIn = signal(false);
  role = signal('admin');

  login() {
    this.isLoggedIn.set(true);
  }

  logout() {
    this.isLoggedIn.set(false);
  }

  setRole(newRole: string) {
    this.role.set(newRole);
  }
}
