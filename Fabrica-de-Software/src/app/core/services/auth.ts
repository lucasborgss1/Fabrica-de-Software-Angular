import { Injectable, signal } from '@angular/core';

import { UserRole } from '../models/api.models';

interface AuthSession {
  token: string;
  role: UserRole;
  professorId: string;
  userName: string;
  loginName: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  readonly isLoggedIn = signal(false);
  readonly role = signal<UserRole>('admin');
  readonly token = signal('');
  readonly professorId = signal('');
  readonly userName = signal('Usuário');
  readonly loginName = signal('');

  constructor() {
    this.restoreSession();
  }

  login(session?: Partial<AuthSession> & { password?: string }) {
    const loginName = session?.loginName?.trim() ?? this.loginName();
    const providedToken = session?.token?.trim() ?? '';
    const tokenFromCredentials =
      loginName && session?.password ? this.encodeBasicToken(loginName, session.password) : '';
    const token = tokenFromCredentials || (providedToken.startsWith('Basic ') ? providedToken : '');
    const resolvedRole = session?.role ?? this.role();
    const resolvedProfessorId = session?.professorId?.trim() || this.professorId();
    const resolvedUserName = session?.userName?.trim() || loginName || this.userName();

    this.token.set(token);
    this.role.set(resolvedRole);
    this.professorId.set(resolvedProfessorId);
    this.userName.set(resolvedUserName);
    this.loginName.set(loginName || resolvedUserName);
    this.isLoggedIn.set(Boolean(token));

    if (token) {
      this.persistSession();
    } else if (this.isBrowser()) {
      localStorage.removeItem('fs-auth');
    }
  }

  logout() {
    this.isLoggedIn.set(false);
    this.token.set('');
    this.role.set('admin');
    this.professorId.set('');
    this.userName.set('Usuário');
    this.loginName.set('');

    if (this.isBrowser()) {
      localStorage.removeItem('fs-auth');
    }
  }

  setRole(newRole: string, persist = false) {
    if (newRole === 'admin' || newRole === 'professor') {
      this.role.set(newRole);
      if (persist) {
        this.persistSession();
      }
    }
  }

  setProfessorId(newProfessorId: string) {
    this.professorId.set(newProfessorId.trim());
    this.persistSession();
  }

  private restoreSession() {
    if (!this.isBrowser()) {
      return;
    }

    const storedSession = localStorage.getItem('fs-auth');

    if (!storedSession) {
      return;
    }

    try {
      const parsed = JSON.parse(storedSession) as Partial<AuthSession>;
      this.login(parsed);
    } catch {
      localStorage.removeItem('fs-auth');
    }
  }

  private persistSession() {
    if (!this.isBrowser() || !this.token()) {
      return;
    }

    const session: AuthSession = {
      token: this.token(),
      role: this.role(),
      professorId: this.professorId(),
      userName: this.userName(),
      loginName: this.loginName(),
    };

    localStorage.setItem('fs-auth', JSON.stringify(session));
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private encodeBasicToken(loginName: string, password: string): string {
    if (typeof btoa !== 'function' || !loginName.trim() || !password.trim()) {
      return '';
    }

    return `Basic ${btoa(`${loginName}:${password}`)}`;
  }
}
