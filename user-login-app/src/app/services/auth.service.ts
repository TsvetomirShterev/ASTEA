import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7027/api';
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        catchError((error) => {
          console.error(error);
          throw error;
        })
      );
  }

  setUserData(user: User) {
    this.userSubject.next(user);
  }

  updatePassword(userId: number, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/password`, { password: newPassword })
      .pipe(
        catchError((error) => {
          console.error(error);
          throw error;
        })
      );
  }
}
