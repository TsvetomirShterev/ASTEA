import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  const token = localStorage.getItem('jwtToken');

  if (token) {
    return true;
  } else {

    router.navigate(['/login']);
    return false;
  }
};
