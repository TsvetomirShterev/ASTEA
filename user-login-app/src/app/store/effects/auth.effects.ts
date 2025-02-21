import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { clearUser, setUser, updatePassword } from '../actions/auth.actions';
import { selectUser, selectToken } from '../auth/auth.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private store: Store
  ) {}

  updatePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePassword),
      switchMap((action) => {
        return this.authService.updatePassword(action.userId, action.newPassword).pipe(
          switchMap(() => {
            return this.store.select(selectUser).pipe(
              take(1),
              switchMap((user) => {
                if (!user) {
                  return of(clearUser());
                }

                return this.store.select(selectToken).pipe(
                  take(1),
                  map((currentToken) => {
                    return setUser({ user: user, token: currentToken ?? '' });
                  })
                );
              })
            );
          }),
          catchError((error) => {
            console.error('Password update failed:', error);
            return of(clearUser());
          })
        );
      })
    )
  );

}
