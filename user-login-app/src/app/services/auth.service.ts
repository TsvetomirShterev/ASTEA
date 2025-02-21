import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';
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

  constructor(private http: HttpClient, private store: Store) { }

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
            this.store.dispatch(setUser({ user: response.user, token: response.token }));
          }
        })
      );
  }

  updatePassword(userId: number, newPassword: string) {
    return this.store.select(selectToken).pipe(
      take(1),
      switchMap((token) => {
        if (!token || this.jwtHelper.isTokenExpired(token)) {
          throw new Error('Token expired');
        }

        return this.http
          .put<{ message: string; user: User }>(
            `${this.apiUrl}/users/${userId}/password`,
            { password: newPassword },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .pipe(
            catchError((error) => {
              console.error('Password update failed:', error);
              throw error;
            })
          );
      })
    );
  }


  logout() {
    this.store.dispatch(clearUser());
  }

  getJwtToken(): Observable<string | null> {
    return this.store.select(selectToken);
  }
}
