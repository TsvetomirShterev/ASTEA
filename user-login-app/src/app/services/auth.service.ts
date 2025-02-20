// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, map, tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { setUser, clearUser } from '../store/actions/auth.actions';
import { selectToken } from '../store/auth/auth.selectors';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:44345/api';
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient, private store: Store) {}

  login(username: string, password: string) {
    return this.http
      .post<{ token: string; user: User }>(`${this.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        catchError((error) => {
          console.error(error);
          throw error;
        }),
        tap((response) => {
          if (response && response.token && response.user) {
            // Dispatch the setUser action to store user and token in the NgRx store
            this.store.dispatch(setUser({ user: response.user, token: response.token }));
          }
        })
      );
  }

  logout() {
    this.store.dispatch(clearUser());
  }

  isAuthenticated(): Observable<boolean> {
    return this.store.select(selectToken).pipe(
      map((token) => {
        if (token) {
          const isExpired = this.jwtHelper.isTokenExpired(token);
          return !isExpired;
        }
        return false;
      })
    );
  }

  getJwtToken(): Observable<string | null> {
    return this.store.select(selectToken);
  }
}
