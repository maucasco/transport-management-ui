import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LoginResponse, User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private readonly LOGIN_URL = '/entreprise/authentication/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<LoginResponse>(this.LOGIN_URL, { email, password })
      .pipe(
        tap((resp) => {
          localStorage.setItem(this.TOKEN_KEY, resp.access_token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(resp.user));
        }),
        map((resp) => resp.user)
      );
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload['exp'] as number) * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}
