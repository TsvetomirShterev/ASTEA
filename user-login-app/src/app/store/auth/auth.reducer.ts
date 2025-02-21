import { createReducer, on } from '@ngrx/store';
import { setUser, clearUser } from '../actions/auth.actions';
import { User } from 'src/app/services/auth.service';

export interface AuthState {
  user: User | null;
  token: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
};

export const authReducer = createReducer(
  initialState,
  on(setUser, (state, { user, token }) => ({
    ...state,
    user,
    token,
  })),
  on(clearUser, (state) => ({
    ...state,
    user: null,
    token: null,
  }))
);

