import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/services/auth.service';


export const setUser = createAction(
  '[Auth] Set User',
  props<{ user: User; token: string }>()
);

export const clearUser = createAction(
  '[Auth] Clear User'
);

export const updatePassword = createAction(
  '[Auth] Update Password',
  props<{ userId: number, newPassword: string }>()
);
