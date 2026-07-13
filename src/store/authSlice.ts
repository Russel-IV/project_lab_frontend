import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '@/api/auth';

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

const storedToken = localStorage.getItem('authToken');
const storedUser = localStorage.getItem('authUser');

const initialState: AuthState = {
  token: storedToken,
  user: storedUser ? (JSON.parse(storedUser) as AuthUser) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('authToken', action.payload.token);
      localStorage.setItem('authUser', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
    updateUserInfo(
      state,
      action: PayloadAction<
        Partial<Pick<AuthUser, 'name' | 'email' | 'profilePictureUrl'>>
      >,
    ) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('authUser', JSON.stringify(state.user));
    },
  },
});

export const { setCredentials, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
